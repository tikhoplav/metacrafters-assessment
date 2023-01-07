// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Module 2. Lesson 2.

contract Proxy {
  address imp;
  uint256 public highestBid = 0;

  function setImplementation(address _imp) public {
    imp = _imp;
  }

  function placeBid(uint256 _bid) public payable {
    (bool success, ) = imp.delegatecall(
      abi.encodeWithSignature("placeBid(uint256)", _bid)
    );
    require(success, "failed to call implementation contract");
  }
}

contract ImplementationOne {
  // For implementation contract to be able to update state of a proxy
  // it should have the same exact storage layout as the proxy.
  address imp;
  uint256 public highestBid = 0;

  function placeBid(uint256 _bid) public payable {
    if (_bid > highestBid) {
      highestBid = _bid;
    }
  }
}

contract ImplementationTwo {
  // For implementation contract to be able to update state of a proxy
  // it should have the same exact storage layout as the proxy.
  address imp;
  uint256 public highestBid = 0;

  function placeBid(uint256 _bid) public payable {
    if (_bid > highestBid) {
      highestBid = _bid * 2;
    }
  }
}