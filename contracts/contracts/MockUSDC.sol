// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Stablecoin de prueba para Arbitrum Sepolia, con grifo público.
 * @dev SOLO PARA TESTNET. En producción se apunta al USDC real de Arbitrum
 *      (`0xaf88d065e77c8cC2239327C5EDb3A432268e5831` en Arbitrum One).
 *
 *      Usa **6 decimales** a propósito, igual que el USDC real. La mayoría de
 *      los tokens de ejemplo usan 18 y eso esconde la clase de bug más común
 *      al integrar stablecoins: multiplicar por 1e18 en el frontend y mover
 *      un billón de veces la cantidad correcta. Si el token de prueba tuviera
 *      18 decimales, ese fallo aparecería recién en producción.
 */
contract MockUSDC is ERC20 {
    /// @notice Cantidad que entrega el grifo por reclamo: 1.000 mUSDC.
    uint256 public constant FAUCET_AMOUNT = 1_000e6;

    /// @notice Espera mínima entre reclamos del grifo.
    uint256 public constant FAUCET_COOLDOWN = 1 hours;

    /// @notice Último reclamo del grifo por dirección.
    mapping(address account => uint256 timestamp) public lastFaucetClaim;

    /// @notice El grifo todavía está en enfriamiento para esta dirección.
    error FaucetCooldownActive(uint256 availableAt);

    event FaucetClaimed(address indexed account, uint256 amount);

    constructor() ERC20("Mock USD Coin", "mUSDC") {}

    /// @inheritdoc ERC20
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Entrega 1.000 mUSDC a quien llame, una vez por hora.
     * @dev Sin control de acceso a propósito: es una testnet y el objetivo es
     *      que cualquiera pueda probar el flujo de donación sin depender de
     *      un grifo externo que puede estar caído el día de la demo.
     */
    function faucet() external {
        uint256 last = lastFaucetClaim[msg.sender];
        if (last != 0) {
            uint256 availableAt = last + FAUCET_COOLDOWN;
            if (block.timestamp < availableAt) {
                revert FaucetCooldownActive(availableAt);
            }
        }

        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }
}
