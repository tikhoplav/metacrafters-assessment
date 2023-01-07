// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @dev Lesson 2. Modifiers
 */
contract Lock {
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner {
        require(owner == msg.sender, "not allowed");
        _;
    } 

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
