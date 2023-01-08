import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Depositor__factory } from "../typechain-types/factories";
import type { Depositor } from "../typechain-types";
import useMetaMask from "./useMetaMask";

export const useDepositor = ({
  address,
}: {
  address: string,
}) => {
  const { ethereum } = useMetaMask();

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

  useEffect(() => {
    if (!contract) return
    contract.owner()
      .then(ownerAddress => setOwnerAddress(ownerAddress.toLowerCase()))
      .catch((error: any) => {
        console.error("Failed to fetch contract owner", error)
      })
  }, [contract]);

  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!contract || !provider) return;
    provider.getBalance(contract.address)
      .then(eth => setBalance(ethers.utils.formatEther(eth)))
      .catch((error: any) => {
        console.error("Failed to fetch contract balance", error);
      })
  }, [contract, provider])

  return {
    contract,
    signer,
    ownerAddress,
    balance,
  }
}

export default useDepositor;