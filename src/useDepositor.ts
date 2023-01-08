import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Depositor__factory } from "../typechain-types/factories";
import type { Depositor } from "../typechain-types";

export const useDepositor = ({
  address,
  ethereum,
  refresh,
}: {
  address: string,
  ethereum: any,
  refresh: () => Promise<void>
}) => {
  const [contract, setContract] = useState<Depositor | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    setContract(null);
    if (!address || !ethereum) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = Depositor__factory.connect(address, signer);
    setContract(contract);
    setSigner(signer);
    setProvider(provider);
  }, [ethereum, address]);

  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

  const fetchOwner = useCallback(() => {
    if (!contract) return
    contract.owner()
      .then(ownerAddress => setOwnerAddress(ownerAddress.toLowerCase()))
      .catch((error: any) => {
        console.error("Failed to fetch contract owner", error)
      })
  }, [contract]);

  useEffect(() => {
    fetchOwner()
  }, [fetchOwner])

  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!contract || !provider) return;
    try {
      const eth = await provider.getBalance(contract.address)
      const balance = ethers.utils.formatEther(eth)
      setBalance(balance)
    } catch (error: any) {
      console.error("Failed to fetch contract balance", error);
    }
  }, [contract, provider])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const withdrawal = useCallback(async (amount: string) => {
    if (!contract) return;
    try {
      const tx = await contract.withdrawal(ethers.utils.parseEther(amount));
      const receipt = await tx.wait();
      await refresh();
      await fetchBalance();
      return receipt;
    } catch (error: any) {
      console.error("Transaction failed", error);
    }
  }, [contract, refresh]);

  const deposit = useCallback(async (amount: string) => {
    if (!contract) return;
    try {
      const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      const receipt = await tx.wait();
      await refresh();
      await fetchBalance();
      return receipt;
    } catch (error: any) {
      console.error("Transaction failed", error);
    }
  }, [contract, refresh])

  return {
    contract,
    signer,
    ownerAddress,
    balance,
    withdrawal,
    deposit,
  }
}

export default useDepositor;