// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @dev Lesson 3. Function types.
 */
contract Scores {
  uint16 currentScore;

  constructor() {
    currentScore = 0;
  }

  function getScore() public view returns (uint16) {
    return currentScore;
  }

  function setScore(uint16 _score) external payable {
    currentScore = _score;
  }

  function isHigher(uint16 _a, uint16 _b) public pure returns (bool) {
    return _a > _b;
  }
}