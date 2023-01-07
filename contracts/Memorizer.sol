// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @dev Module 2, Lesson 1: Memory
 */
contract Memorizer {
  // This is a storage.
  uint256 public highestBid = 0;

  function placeBid(uint256 _bid) public {
    // _bid here is sotored in memory.
    if (_bid > highestBid) {
      // Here data from memory is trasfered to the storage.
      highestBid = _bid;
    }

    // Function scope ends, _bid is discarded here.
  }
}