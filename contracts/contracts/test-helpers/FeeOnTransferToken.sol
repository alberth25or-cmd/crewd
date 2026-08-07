// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice Token que se queda un 1% en cada transferencia. Solo para tests.
 * @dev Existe para comprobar que `CrewdFunding.donate` contabiliza por
 *      diferencia de saldo y no por el nominal pedido. Si confiara en el
 *      nominal, el contrato registraría deuda que nunca recibió y los
 *      últimos donantes en reclamar se quedarían sin fondos.
 */
contract FeeOnTransferToken is ERC20 {
    uint256 public constant FEE_BPS = 100; // 1%

    constructor() ERC20("Fee Token", "FEE") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }
        uint256 fee = (value * FEE_BPS) / 10_000;
        super._update(from, to, value - fee);
        super._update(from, address(0), fee); // la comisión se quema
    }
}
