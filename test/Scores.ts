import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Scores", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Scores = await ethers.getContractFactory("Scores");
    const scores = await Scores.deploy();

    return { scores, owner, otherAccount };
  }

  describe("Functions", () => {
    it("Should set and provide a current score", async () => {
      const { scores } = await loadFixture(deployFixture);

      expect(await scores.getScore()).to.equal(0);
      expect(scores.setScore(22)).to.not.be.fulfilled;
      expect(await scores.getScore()).to.equal(22);
    });

    it("Should provide a pure function", async () => {
      const { scores } = await loadFixture(deployFixture);

      expect(await scores.isHigher(12, 10)).to.equal(true);
      expect(await scores.isHigher(10, 12)).to.equal(false);
      expect(await scores.isHigher(10, 10)).to.equal(false);
    });
  })
})