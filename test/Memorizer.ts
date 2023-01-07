import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Memorizer", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("Memorizer");
    const contract = await Contract.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Storage vs Memory", () => {
    it("Storage data is persistent", async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.highestBid()).to.equal(0);

      await expect(contract.placeBid(10)).to.be.fulfilled;

      expect(await contract.highestBid()).to.equal(10);
    });
  })
})