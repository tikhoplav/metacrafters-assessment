// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @dev Assessment.
 */
contract DogCatcher {
  address owner;

  uint256 public price;
  bool public isAvailable;
  
  string forbiden = "pitbul";

  constructor() {
    owner = msg.sender;
    price = 10;
    isAvailable = true;
  }

  /**
   * @dev calls a dog catcher. On success turns catcher unavailable
   * untill the `enable` is called by the owner.
   */
  function callCatcher(string calldata _breed) public payable {
    // Check if dog breed is not the forbiden one. Since it is a constant
    // assert can be used. Gas not returned.
    assert(keccak256(abi.encodePacked(forbiden)) != keccak256(abi.encodePacked(_breed)));

    // Check if dog catcher is available, if not return unspent gas.
    if (!isAvailable) {
      revert("Dog catcher is busy");
    }

    // Everything is fine, dog catcher is dispatched.
    isAvailable = false;
  }

  /**
   * @dev When job is done and dog catcher is ready for the next job,
   * the owner should set availability back to true.
   */
  function enable() public {
    // Check if caller is the actual owner.
    require(msg.sender == owner, "Not allowed");

    if (isAvailable) {
      revert("Dog catcher is already available...");
    }

    // Turn dog catcher back available.
    isAvailable = true;
  }
}