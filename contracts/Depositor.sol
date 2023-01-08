// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @dev Module 3, Lesson 1. Fallback and payable functions.
 */
contract Depositor {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  function withdrawal(uint _amount) public {
    require(msg.sender == owner, "Not allowed");
    owner.transfer(_amount);
  }

  /**
   * @dev previous `deposit` function is change to receive function
   * to distinguish Ether transfers from interface confusions.
   */
  receive() external payable {
    // emit Deposit(msg.sender, msg.value);
  }

  /**
   * @dev The fallback function, simply return funds to the sender.
   */
  fallback() external payable {
    revert("Function not exists");
  }
}