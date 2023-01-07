import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Transactor", () => {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();

    const Transactor = await ethers.getContractFactory("Transactor");
    const transactor = await Transactor.deploy();

    return { transactor, owner };
  }

  describe("Global functions", () => {
    it("Returns correct values", async () => {
      const { transactor, owner } = await loadFixture(deployFixture);

      const value = ethers.utils.parseEther('0.03');

      await expect(transactor.sendAndGetInfo({
        value,
        gasLimit: 30000
      }))
        .to.emit(transactor, "Report")
        .withArgs(owner.address, value, 8832)
    })
  })
})