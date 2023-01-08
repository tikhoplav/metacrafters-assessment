import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Depositor", () => {
  async function deployFixture() {
    const initBalance = ethers.utils.parseEther('10');

    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("Depositor");
    const contract = await Contract.deploy({
      value: initBalance,
    });

    return { contract, owner, otherAccount, initBalance };
  }

  describe("Validations", () => {
    it("Owner can withdrawal", async () => {
      const { contract, owner, initBalance } = await loadFixture(deployFixture);

      await expect(contract.connect(owner).withdrawal(initBalance))
        .to.be.fulfilled
    });

    it("Only owner can withdrawal", async () => {
      const { contract, otherAccount, initBalance } = await loadFixture(deployFixture);

      await expect(contract.connect(otherAccount).withdrawal(initBalance))
        .to.be.rejectedWith("Not allowed")
    })
  });

  describe("Functions", () => {
    it("Should withdrawal the correct amount", async () => {
      const { contract, owner, initBalance } = await loadFixture(deployFixture);

      await expect(contract.connect(owner).withdrawal(initBalance.div(10))).to.be.fulfilled;

      expect(await ethers.provider.getBalance(contract.address)).to.equal(initBalance.mul(9).div(10))
    })

    it("Should deposit the correct amount", async () => {
      const { contract, otherAccount, initBalance } = await loadFixture(deployFixture);

      await expect(contract.connect(otherAccount).deposit({
        value: initBalance.div(10)
      })).to.be.fulfilled;

      expect(await ethers.provider.getBalance(contract.address)).to.equal(initBalance.div(10).mul(11))
    })
  });
})