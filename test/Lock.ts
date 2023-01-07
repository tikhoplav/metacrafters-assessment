import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy({ value: lockedAmount });

    return { lock, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the owner", async function () {
      const { lock, owner } = await loadFixture(deployFixture);
      
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert if called by non-owner", async function () {
        const { lock, otherAccount } = await loadFixture(deployFixture);

        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "not allowed"
        );
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, lockedAmount, owner } = await loadFixture(
          deployFixture
        );

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});

