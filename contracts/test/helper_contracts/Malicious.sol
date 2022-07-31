// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Malicious {
    uint256 public i;
    address lastCaller;

    // Function is not view only -- it alters the state
    function balanceOf(address _owner) external returns (uint256) {
        i++;
        lastCaller = _owner;

        return(350);
    }
}