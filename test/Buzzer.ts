import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Buzzer", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Buzzer = await ethers.getContractFactory("Buzzer");
    const buzzer = await Buzzer.deploy();

    return { buzzer, owner, otherAccount };
  }

  describe("Events", () => {
    it("Should emit Ping event on ping", async () => {
      const { buzzer, otherAccount } = await loadFixture(deployFixture);

      await expect(buzzer.ping(otherAccount.address))
        .to.emit(buzzer, "Ping")
        .withArgs(otherAccount.address);
    })

    it("Should emit Whisper event on whisper", async () => {
      const { buzzer, owner, otherAccount } = await loadFixture(deployFixture);

      const msg = "Hey, are you there?";
      await expect(buzzer.whisper(otherAccount.address, msg))
        .to.emit(buzzer, "Whisper")
        .withArgs(owner.address, otherAccount.address, msg)
    })

    it("Should emit Buzz event on broadcast", async () => {
      const { buzzer, owner } = await loadFixture(deployFixture);

      await expect(buzzer.broadcast("foo", "Hello, World!!"))
        .to.emit(buzzer, "Buzz")
        .withArgs(owner.address, "foo", "Hello, World!!");
    })
  })
})