// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CrewdFunding} from "../CrewdFunding.sol";

/**
 * @notice Donante malicioso que intenta reentrar en `claimRefund`.
 * @dev El vector realista con ERC-20 no es el receptor sino el token: un
 *      token con ganchos de transferencia (estilo ERC-777) puede devolver
 *      el control al donante en medio del pago. Este par de contratos
 *      reproduce exactamente eso.
 */
contract ReentrantDonor {
    CrewdFunding public funding;
    IERC20 public token;
    uint256 public projectId;

    bool public reentryAttempted;
    bool public reentryReverted;
    bool private _armed;

    function configure(CrewdFunding _funding, IERC20 _token, uint256 _projectId) external {
        funding = _funding;
        token = _token;
        projectId = _projectId;
    }

    function donate(uint256 amount) external {
        token.approve(address(funding), amount);
        funding.donate(projectId, amount);
    }

    function claim() external {
        _armed = true;
        funding.claimRefund(projectId);
        _armed = false;
    }

    /// @dev Lo invoca el token mientras el contrato de tesorería nos paga.
    function onTokenReceived() external {
        if (!_armed || reentryAttempted) return;
        reentryAttempted = true;
        try funding.claimRefund(projectId) {
            reentryReverted = false;
        } catch {
            reentryReverted = true;
        }
    }
}

/// @notice Token con gancho de transferencia, para armar la reentrada.
contract HookToken is ERC20 {
    ReentrantDonor public hookTarget;

    constructor() ERC20("Hook Token", "HOOK") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function setHookTarget(ReentrantDonor target) external {
        hookTarget = target;
    }

    function _update(address from, address to, uint256 value) internal override {
        super._update(from, to, value);
        if (address(hookTarget) != address(0) && to == address(hookTarget) && from != address(0)) {
            hookTarget.onTokenReceived();
        }
    }
}
