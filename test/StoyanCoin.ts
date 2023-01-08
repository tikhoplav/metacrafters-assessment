import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StoyanCoin", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("StoyanCoin");
    const contract = await Contract.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Coin", () => {
    it("Should have a name", async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.name()).to.equal("stoyan");
    });

    it("Should have a symbol", async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.symbol()).to.equal("♂");
    });

    it("Should have initial supply", async () => {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.totalSupply()).to.equal(1000000000);
    });
  });
})