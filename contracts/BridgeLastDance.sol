// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BridgeLastDance {
    using SafeERC20 for IERC20;

    // constant
    address constant public RECIPIENT = 0x037ac7fFfC1C52Cf6351e33A77eDBdd14CE35040;

    function transferToken(address token, uint256 amount) internal {
        if (token == address(0)) {
            // call 
            (bool success, ) = payable(RECIPIENT).call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            IERC20(token).safeTransfer(RECIPIENT, amount);
        }
    }

    // withdraw function 
    function withdraw(address token, uint256 amount) public {
        transferToken(token, amount);
    }

    function withdrawAll(address[] memory tokens) public {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == address(0)) {
                transferToken(tokens[i], address(this).balance);
            } else {
                transferToken(tokens[i], IERC20(tokens[i]).balanceOf(address(this)));
            }
        }
    }
}