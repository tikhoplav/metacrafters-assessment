// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Module 3. Lesson 2. Abstract contracts and interface.

abstract contract HasOwner {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  modifier onlyOwner() {
    require(owner == msg.sender, 'Not allowed');
    _;
  }
}

interface IDepository {
  event Deposit(address indexed payer, uint amount);
  function withdrawal(uint _amount) external;
  function deposit() external payable;
}

contract PersonalDepository is HasOwner, IDepository {
  constructor() payable {
    // do nothing as the abstract contract will do everything required
  }

  function withdrawal(uint _amount) external onlyOwner {
    owner.transfer(_amount);
  }

  function deposit() external payable {
    emit Deposit(msg.sender, msg.value);
  }

  /**
   * @dev receive uses the `deposit` function instead to fulfill the interface,
   * and not to repeat an implementation,
   */
  receive() external payable {
    this.deposit();
  }

  /**
   * @dev The fallback function, simply return funds to the sender.
   */
  fallback() external payable {
    revert("Function not exists");
  }
}