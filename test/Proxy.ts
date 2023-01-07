import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Proxy", () => {
  async function deployFixture() {

    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const ImpOne = await ethers.getContractFactory("ImplementationOne");
    const impOne = await ImpOne.deploy();

    const ImpTwo = await ethers.getContractFactory("ImplementationTwo");
    const impTwo = await ImpTwo.deploy();

    return { proxy, impOne, impTwo };
  }

  describe("Implementation contract switch", () => {
    it("Should change the way result is computed", async () => {
      const { proxy, impOne, impTwo } = await loadFixture(deployFixture);

      expect(await proxy.highestBid()).to.equal(0);
      await expect(proxy.setImplementation(impOne.address)).to.be.fulfilled;
      await expect(proxy.placeBid(10)).to.be.fulfilled;
      expect(await proxy.highestBid()).to.equal(10);
      
      // Now switch the implementation contract, state is going to be updated
      // using new calculation rules.
      await expect(proxy.setImplementation(impTwo.address)).to.be.fulfilled;
      await expect(proxy.placeBid(12)).to.be.fulfilled;
      expect(await proxy.highestBid()).to.equal(24);
    });
  })
})