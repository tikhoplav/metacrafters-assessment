import { ethers } from "hardhat";

async function main() {
  const lockedAmount = ethers.utils.parseEther("10");

  const Contract = await ethers.getContractFactory("Depositor");
  const contract = await Contract.deploy({ value: lockedAmount });

  await contract.deployed();

  console.log(`Contract is deployed to ${contract.address} with 10 ETH`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
