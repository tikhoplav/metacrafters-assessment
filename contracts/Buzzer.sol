// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @dev Lesson 4. Events.
 */
contract Buzzer {
  event Ping (address indexed recipient);
  event Whisper (address indexed sender, address indexed recipient, string message);
  event Buzz (address indexed sender, string indexed theme, string message);

  function ping(address _recipient) public payable {
    emit Ping(_recipient);
  }

  function whisper(address _recipient, string calldata _message) public payable {
    emit Whisper(msg.sender, _recipient, _message);
  }

  function broadcast(string calldata _theme, string calldata _message) public payable {
    emit Buzz(msg.sender, _theme, _message);
  }
}