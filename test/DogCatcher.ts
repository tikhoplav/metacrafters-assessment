import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DogCatcher", () => {
  // Take a snapshot of the network to use it for each test.
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("DogCatcher");
    const contract = await Contract.deploy();

    return { contract, owner, otherAccount };
  }

  it("Should call a dog catcher", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    expect(contract.connect(otherAccount).callCatcher("pug"))
      .to.fulfilled;
  })

  it("Should turn catcher unavailable on call", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    await contract.connect(otherAccount).callCatcher("pug");

    expect(await contract.isAvailable()).to.equal(false);
  })

  it("Should reject calls with forbidden breed", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    await expect(contract.connect(otherAccount).callCatcher("pitbul"))
      .to.be.rejectedWith("VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)");
  })

  it("Should revert a call when catcher is unavailable", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    await contract.connect(otherAccount).callCatcher("pug");

    await expect(contract.connect(otherAccount).callCatcher("dachshund"))
      .to.be.revertedWith("Dog catcher is busy");
  })

  it("Should re-enable catcher on `enable`", async () => {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.connect(otherAccount).callCatcher("pug");

    await contract.connect(owner).enable();

    expect(await contract.isAvailable()).to.equal(true);
  })

  it("Should reject `enable` if called by non-owner", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    await expect(contract.connect(otherAccount).enable())
      .to.be.rejectedWith("Not allowed")
  })

  it("Should revert if `enable` called when available", async () => {
    const { contract, owner } = await loadFixture(deployFixture);

    expect(await contract.isAvailable()).to.equal(true);
    await expect(contract.connect(owner).enable())
      .to.be.revertedWith("Dog catcher is already available...")
  })

  it("Should give a transaction ID on call", async () => {
    const { contract, otherAccount } = await loadFixture(deployFixture);

    const res = await contract.connect(otherAccount).callCatcher('pug');
    console.log((await res.wait()).transactionHash);
  })
})