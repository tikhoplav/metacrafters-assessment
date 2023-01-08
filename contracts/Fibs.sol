// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @dev Module 3. Lesson 3. View and pure functions
 */
contract Fibs {
  uint256 _prev = 0; // private, not visible
  uint256 _curr = 1; // private, not visible

  function add(uint256 _a, uint256 _b) public pure returns (uint256) {
    return _a + _b;
  }

  function next() public view returns (uint256) {
    return this.add(_prev, _curr);
  }

  function stepup() external payable {
    uint256 _next = this.next();
    _prev = _curr;
    _curr = _next;
  }
}