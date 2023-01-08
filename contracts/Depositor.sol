// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @dev Module 2, Lesson 4. FE - contract interaction.
 */
contract Depositor {
  address payable public owner;

  // event Withdrawal(uint indexed amount);
  // event Deposit(address indexed sender, uint indexed amount);

  constructor() payable {
    owner = payable(msg.sender);
  }

  function withdrawal(uint _amount) public {
    require(msg.sender == owner, "Not allowed");
    // require(address(this).balance >= _amount, "Insufficient funds");
    owner.transfer(_amount);
    // emit Withdrawal(_amount);
  }

  function deposit() public payable {
    // emit Deposit(msg.sender, msg.value);
  }
}