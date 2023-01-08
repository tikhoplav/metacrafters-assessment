import { useEffect, useState, useCallback, useMemo } from "react";
import { ethers } from "ethers";

export const useMetaMask = () => {
  const [ethereum, setEthereum] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const { ethereum } = window as any;

    if (!ethereum || !ethereum.isMetaMask) return;

    const onConnect = ({ chainId }: { chainId: string }) => {
      setChainId(chainId);
    };
    ethereum.on("connect", onConnect);

    const onDisconnect = (error: any) => {
      setAccount(null);
      setChainId(null);
    };
    ethereum.on("disconnect", onDisconnect);

    const onAccountsChanged = (accounts: string[]) => {
      console.log("Accounts was changed!!")
      const [account] = accounts; 
      setAccount(account);
      console.log("account changed, refreshing balance")
      ethereum.request({ method: "eth_getBalance", params: [account, 'latest']})
        .then((eth: ethers.BigNumberish) => {
          const balance = ethers.utils.formatEther(eth);
          setBalance(balance)
        })
    };
    ethereum.on("accountsChanged", onAccountsChanged);

    const onChainChanged = (chainId: string) => {
      setChainId(chainId);
    };
    ethereum.on("chainChanged", onChainChanged);

    ethereum
      .request({ method: "eth_accounts" })
      .then(onAccountsChanged)
      .catch((e: any) => console.error("Failed to get metamask accounts", e));

    ethereum
      .request({ method: "eth_chainId" })
      .then(setChainId)
      .catch((e: any) => console.error("Failed to get metamask chainId", e));

    setEthereum(ethereum);

    return () => {
      ethereum.removeListener("connect", onConnect);
      ethereum.removeListener("disconnect", onDisconnect);
      ethereum.removeListener("accountsChanged", onAccountsChanged);
      ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [(window as any).ethereum])

  /**
     * Connect a MetaMask wallet. This would trigger the MetaMask browser
     * extension to start the connection dialog.
     */
  const connect = useCallback(async () => {
    if (!ethereum) return Promise.reject("window.ethereum is undefined");
    return await ethereum.request({ method: "eth_accounts" });
  }, [ethereum]);

  /**
     * Shows if MetaMask is connected and at there is at least one available
     * account.
     */
  const connected: boolean = useMemo(() => {
    return !!account;
  }, [account]);

  const refresh = useCallback(async () => {
    if (!account || !ethereum) return
    try {
      const eth = await ethereum.request({ method: "eth_getBalance", params: [account, 'latest']})
      const balance = ethers.utils.formatEther(eth);
      setBalance(balance)
    } catch (error: any) {
      console.error("Failed to refresh", error)
    }
  }, [ethereum, account])

  return {
    ethereum,
    account,
    chainId,
    balance,
    connect,
    connected,
    refresh,
  }
}

export default useMetaMask;