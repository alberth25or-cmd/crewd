// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

/**
 * @title CrewdFunding
 * @author Crewd
 * @notice Tesorería por proyecto: recibe donaciones en una stablecoin, las
 *         mantiene en depósito y las libera al equipo solo contra hitos
 *         verificados. Si el proyecto muere, lo no liberado vuelve a los
 *         donantes en proporción a lo que aportó cada uno.
 *
 * @dev DECISIONES DE DISEÑO
 *
 *      1. **El líder no puede retirar solo.** Firma un hito con evidencia y
 *         un verificador lo aprueba. Sin esa segunda firma no se mueve nada.
 *         Es lo que separa esto de una alcancía donde el líder tiene la llave.
 *
 *      2. **Cada hito libera `depósito / hitos_restantes`.** No una fracción
 *         fija del total. Así las donaciones que llegan tarde se reparten
 *         entre los hitos que quedan, en vez de quedar atrapadas o inflar
 *         un solo pago. En el último hito el divisor es 1, de modo que el
 *         polvo de las divisiones enteras se liquida ahí y no queda residuo.
 *
 *      3. **Reembolso con foto del momento del fallo.** Al marcar el fallo se
 *         congela `refundPool`. Cada donante reclama
 *         `refundPool * aportado / totalRecaudado`. Sin la foto, quien
 *         reclamara primero se llevaría de más.
 *
 *      4. **Reembolsos en modo pull, y no se pausan.** El contrato nunca
 *         empuja dinero a una lista de direcciones — un solo receptor que
 *         revierte bloquearía a todos. Y `claimRefund` funciona incluso con
 *         el contrato pausado: pausar debe frenar la entrada de dinero, no
 *         encerrar el que ya está dentro.
 *
 *      5. **Nada de datos personales on-chain.** Solo el hash del slug del
 *         proyecto y URIs de evidencia. La identidad vive fuera de la cadena.
 *
 *      LIMITACIONES CONOCIDAS (documentadas, no accidentales)
 *
 *      - El rol de verificador está centralizado en la plataforma. Es el
 *        punto de confianza que queda por resolver; la vía natural es que
 *        los donantes voten la aprobación del hito.
 *      - Las divisiones enteras dejan polvo de una unidad (10^-6 USDC) que
 *        queda en el contrato. Es despreciable y no se barre para no añadir
 *        una función privilegiada que mueva fondos.
 *      - Este contrato no ha sido auditado. Es un MVP de testnet.
 */
contract CrewdFunding is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    using SafeCast for uint256;

    /* ------------------------------- Roles -------------------------------- */

    /// @notice Puede registrar proyectos nuevos.
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");

    /// @notice Puede aprobar o rechazar hitos y declarar fallido un proyecto.
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /* ------------------------------- Tipos -------------------------------- */

    enum ProjectStatus {
        Active,
        Completed,
        Failed
    }

    enum MilestoneStatus {
        Pending,
        Submitted,
        Approved,
        Rejected
    }

    struct Project {
        address leader; //           ─┐
        uint32 milestoneCount; //     │ slot 0
        uint32 milestonesApproved; // │
        ProjectStatus status; //     ─┘
        uint128 totalRaised; //      ─┐ slot 1
        uint128 totalReleased; //    ─┘
        uint128 refundPool; //        slot 2 (foto al fallar)
        bytes32 slugHash; //          slot 3
    }

    struct Milestone {
        MilestoneStatus status;
        uint128 released;
        string evidenceURI;
    }

    /* ------------------------------ Estado -------------------------------- */

    /// @notice Stablecoin en la que se recauda. Inmutable: un proyecto no
    ///         puede cambiar de moneda a mitad de camino.
    IERC20 public immutable token;

    /// @notice Tope de hitos por proyecto, para acotar las vistas que iteran.
    uint32 public constant MAX_MILESTONES = 24;

    uint256 public projectCount;

    mapping(uint256 projectId => Project) private _projects;
    mapping(uint256 projectId => mapping(uint256 index => Milestone)) private _milestones;
    mapping(uint256 projectId => mapping(address donor => uint256 amount)) public contributionOf;
    mapping(uint256 projectId => mapping(address donor => bool)) public hasClaimedRefund;

    /// @notice Evita registrar dos veces el mismo proyecto del catálogo.
    mapping(bytes32 slugHash => uint256 projectId) public projectIdBySlugHash;

    /* ------------------------------ Eventos ------------------------------- */

    event ProjectCreated(
        uint256 indexed projectId,
        bytes32 indexed slugHash,
        address indexed leader,
        uint32 milestoneCount,
        string slug
    );
    event DonationReceived(
        uint256 indexed projectId,
        address indexed donor,
        uint256 amount,
        uint256 totalRaised
    );
    event MilestoneSubmitted(uint256 indexed projectId, uint256 indexed index, string evidenceURI);
    event MilestoneApproved(
        uint256 indexed projectId,
        uint256 indexed index,
        address indexed leader,
        uint256 amountReleased
    );
    event MilestoneRejected(uint256 indexed projectId, uint256 indexed index, string reason);
    event ProjectCompleted(uint256 indexed projectId, uint256 totalReleased);
    event ProjectFailed(uint256 indexed projectId, uint256 refundPool);
    event RefundClaimed(uint256 indexed projectId, address indexed donor, uint256 amount);

    /* ------------------------------ Errores ------------------------------- */

    error ZeroAddress();
    error InvalidMilestoneCount(uint32 given, uint32 max);
    error EmptySlugHash();
    error SlugAlreadyRegistered(bytes32 slugHash, uint256 existingProjectId);
    error UnknownProject(uint256 projectId);
    error ProjectNotActive(uint256 projectId, ProjectStatus status);
    error ProjectNotFailed(uint256 projectId, ProjectStatus status);
    error NotProjectLeader(uint256 projectId, address caller);
    error MilestoneOutOfRange(uint256 index, uint32 milestoneCount);
    error MilestoneNotSubmittable(MilestoneStatus status);
    error MilestoneNotSubmitted(MilestoneStatus status);
    error EmptyEvidence();
    error ZeroAmount();
    error NothingToRefund();
    error RefundAlreadyClaimed();

    /* --------------------------- Construcción ----------------------------- */

    /**
     * @param stablecoin Token ERC-20 de recaudación.
     * @param admin Recibe los tres roles iniciales. Debe ser un multisig en
     *              cualquier despliegue que no sea de prueba.
     */
    constructor(IERC20 stablecoin, address admin) {
        if (address(stablecoin) == address(0) || admin == address(0)) revert ZeroAddress();

        token = stablecoin;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CURATOR_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    /* ----------------------------- Modificadores -------------------------- */

    modifier projectExists(uint256 projectId) {
        if (projectId == 0 || projectId > projectCount) revert UnknownProject(projectId);
        _;
    }

    /* ------------------------------ Escritura ----------------------------- */

    /**
     * @notice Registra un proyecto del catálogo y abre su tesorería.
     * @param slug Slug del proyecto fuera de la cadena. Se emite en el evento
     *             para que un indexador pueda enlazarlo sin consultar la API.
     * @param leader Dirección que recibe las liberaciones por hito.
     * @param milestoneCount Número de hitos, normalmente uno por sprint.
     * @return projectId Identificador on-chain, empieza en 1.
     */
    function createProject(
        string calldata slug,
        address leader,
        uint32 milestoneCount
    ) external onlyRole(CURATOR_ROLE) whenNotPaused returns (uint256 projectId) {
        if (leader == address(0)) revert ZeroAddress();
        if (milestoneCount == 0 || milestoneCount > MAX_MILESTONES) {
            revert InvalidMilestoneCount(milestoneCount, MAX_MILESTONES);
        }

        bytes32 slugHash = keccak256(bytes(slug));
        if (slugHash == keccak256("")) revert EmptySlugHash();

        uint256 existing = projectIdBySlugHash[slugHash];
        if (existing != 0) revert SlugAlreadyRegistered(slugHash, existing);

        projectId = ++projectCount;
        projectIdBySlugHash[slugHash] = projectId;

        Project storage p = _projects[projectId];
        p.leader = leader;
        p.milestoneCount = milestoneCount;
        p.status = ProjectStatus.Active;
        p.slugHash = slugHash;

        emit ProjectCreated(projectId, slugHash, leader, milestoneCount, slug);
    }

    /**
     * @notice Dona a la tesorería de un proyecto. Requiere `approve` previo.
     * @dev Contabiliza por diferencia de saldo en vez de confiar en `amount`.
     *      Un token con comisión de transferencia entregaría menos de lo
     *      pedido, y anotar el nominal dejaría el contrato debiendo dinero
     *      que nunca recibió — los últimos en reclamar se quedarían sin nada.
     */
    function donate(
        uint256 projectId,
        uint256 amount
    ) external nonReentrant whenNotPaused projectExists(projectId) {
        if (amount == 0) revert ZeroAmount();

        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Active) revert ProjectNotActive(projectId, p.status);

        uint256 balanceBefore = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = token.balanceOf(address(this)) - balanceBefore;
        if (received == 0) revert ZeroAmount();

        contributionOf[projectId][msg.sender] += received;
        p.totalRaised += received.toUint128();

        emit DonationReceived(projectId, msg.sender, received, p.totalRaised);
    }

    /**
     * @notice El líder declara un hito entregado y adjunta la evidencia.
     * @param evidenceURI Enlace a la prueba (IPFS, repositorio, documento).
     *                    No debe contener datos personales.
     */
    function submitMilestone(
        uint256 projectId,
        uint256 index,
        string calldata evidenceURI
    ) external whenNotPaused projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (msg.sender != p.leader) revert NotProjectLeader(projectId, msg.sender);
        if (p.status != ProjectStatus.Active) revert ProjectNotActive(projectId, p.status);
        if (index >= p.milestoneCount) revert MilestoneOutOfRange(index, p.milestoneCount);
        if (bytes(evidenceURI).length == 0) revert EmptyEvidence();

        Milestone storage m = _milestones[projectId][index];
        // Un hito rechazado se puede volver a presentar; uno aprobado no.
        if (m.status != MilestoneStatus.Pending && m.status != MilestoneStatus.Rejected) {
            revert MilestoneNotSubmittable(m.status);
        }

        m.status = MilestoneStatus.Submitted;
        m.evidenceURI = evidenceURI;

        emit MilestoneSubmitted(projectId, index, evidenceURI);
    }

    /**
     * @notice Aprueba un hito y libera su parte del depósito al líder.
     * @dev Sigue checks-efectos-interacciones: todo el estado queda escrito
     *      antes de la transferencia, y además lleva `nonReentrant`.
     */
    function approveMilestone(
        uint256 projectId,
        uint256 index
    ) external onlyRole(VERIFIER_ROLE) nonReentrant whenNotPaused projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Active) revert ProjectNotActive(projectId, p.status);
        if (index >= p.milestoneCount) revert MilestoneOutOfRange(index, p.milestoneCount);

        Milestone storage m = _milestones[projectId][index];
        if (m.status != MilestoneStatus.Submitted) revert MilestoneNotSubmitted(m.status);

        // Reparte lo que hay entre los hitos que faltan. En el último el
        // divisor es 1, así que se lleva el residuo de las divisiones previas.
        uint256 remaining = p.milestoneCount - p.milestonesApproved;
        uint256 amount = (uint256(p.totalRaised) - uint256(p.totalReleased)) / remaining;

        // EFECTOS
        m.status = MilestoneStatus.Approved;
        m.released = amount.toUint128();
        p.milestonesApproved += 1;
        p.totalReleased += amount.toUint128();

        address leader = p.leader;
        bool finished = p.milestonesApproved == p.milestoneCount;
        if (finished) p.status = ProjectStatus.Completed;

        emit MilestoneApproved(projectId, index, leader, amount);
        if (finished) emit ProjectCompleted(projectId, p.totalReleased);

        // INTERACCIONES
        if (amount != 0) token.safeTransfer(leader, amount);
    }

    /// @notice Rechaza un hito. El líder puede corregir y volver a presentarlo.
    function rejectMilestone(
        uint256 projectId,
        uint256 index,
        string calldata reason
    ) external onlyRole(VERIFIER_ROLE) projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Active) revert ProjectNotActive(projectId, p.status);
        if (index >= p.milestoneCount) revert MilestoneOutOfRange(index, p.milestoneCount);

        Milestone storage m = _milestones[projectId][index];
        if (m.status != MilestoneStatus.Submitted) revert MilestoneNotSubmitted(m.status);

        m.status = MilestoneStatus.Rejected;

        emit MilestoneRejected(projectId, index, reason);
    }

    /**
     * @notice Declara el proyecto fallido y congela el reparto del reembolso.
     * @dev A partir de aquí no entran ni salen fondos salvo por `claimRefund`.
     */
    function markFailed(
        uint256 projectId
    ) external onlyRole(VERIFIER_ROLE) projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Active) revert ProjectNotActive(projectId, p.status);

        uint128 pool = p.totalRaised - p.totalReleased;
        p.status = ProjectStatus.Failed;
        p.refundPool = pool;

        emit ProjectFailed(projectId, pool);
    }

    /**
     * @notice Reclama la parte proporcional del depósito no liberado.
     * @dev No lleva `whenNotPaused` a propósito: pausar el contrato debe
     *      frenar la entrada de dinero, no atrapar el que ya está dentro.
     */
    function claimRefund(
        uint256 projectId
    ) external nonReentrant projectExists(projectId) returns (uint256 amount) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Failed) revert ProjectNotFailed(projectId, p.status);
        if (hasClaimedRefund[projectId][msg.sender]) revert RefundAlreadyClaimed();

        uint256 contributed = contributionOf[projectId][msg.sender];
        if (contributed == 0) revert NothingToRefund();

        amount = (uint256(p.refundPool) * contributed) / uint256(p.totalRaised);

        // EFECTOS
        hasClaimedRefund[projectId][msg.sender] = true;

        emit RefundClaimed(projectId, msg.sender, amount);

        // INTERACCIONES
        if (amount != 0) token.safeTransfer(msg.sender, amount);
    }

    /* --------------------------- Administración --------------------------- */

    /// @notice Parada de emergencia. No afecta a `claimRefund`.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /* ------------------------------- Lectura ------------------------------ */

    function getProject(
        uint256 projectId
    ) external view projectExists(projectId) returns (Project memory) {
        return _projects[projectId];
    }

    function getMilestone(
        uint256 projectId,
        uint256 index
    ) external view projectExists(projectId) returns (Milestone memory) {
        if (index >= _projects[projectId].milestoneCount) {
            revert MilestoneOutOfRange(index, _projects[projectId].milestoneCount);
        }
        return _milestones[projectId][index];
    }

    /// @notice Todos los hitos de un proyecto. Acotado por `MAX_MILESTONES`.
    function getMilestones(
        uint256 projectId
    ) external view projectExists(projectId) returns (Milestone[] memory list) {
        uint32 count = _projects[projectId].milestoneCount;
        list = new Milestone[](count);
        for (uint256 i = 0; i < count; ++i) {
            list[i] = _milestones[projectId][i];
        }
    }

    /// @notice Fondos aún en depósito, es decir recaudado menos liberado.
    function escrowOf(
        uint256 projectId
    ) external view projectExists(projectId) returns (uint256) {
        Project storage p = _projects[projectId];
        return uint256(p.totalRaised) - uint256(p.totalReleased);
    }

    /// @notice Cuánto podría reclamar un donante. Cero si el proyecto no falló.
    function refundableOf(
        uint256 projectId,
        address donor
    ) external view projectExists(projectId) returns (uint256) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Failed) return 0;
        if (hasClaimedRefund[projectId][donor]) return 0;

        uint256 contributed = contributionOf[projectId][donor];
        if (contributed == 0 || p.totalRaised == 0) return 0;

        return (uint256(p.refundPool) * contributed) / uint256(p.totalRaised);
    }
}
