import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fibs", () => {
  async function deployFixture() {
    const Contract = await ethers.getContractFactory("Fibs");
    const contract = await Contract.deploy();

    return { contract };
  }

  it("Pure function returns correct result", async () => {
    const { contract } = await loadFixture(deployFixture);

    expect(await contract.add(3,5)).to.equal(8);
  });

  it("View function return result based on state", async () => {
    const { contract } = await loadFixture(deployFixture);

    expect(await contract.next()).to.equal(1);

    // what a waste of gas...
    await expect(contract.stepup()).to.be.fulfilled;
    await expect(contract.stepup()).to.be.fulfilled;
    await expect(contract.stepup()).to.be.fulfilled;

    expect(await contract.next()).to.equal(5);
  });
})