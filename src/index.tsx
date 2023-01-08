import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import useDepositor from "./useDepositor";
import useMetaMask from "./useMetaMask";

const App = () => {
  // This should be global context instead.
  const { ethereum, connect, connected, account, balance, chainId, refresh } = useMetaMask();

  const { contract, ownerAddress, balance: depositorBalance, withdrawal, deposit } = useDepositor({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    ethereum: ethereum,
    refresh: refresh,
  });

  const isOwner = useMemo(() => {
    return account === ownerAddress
  }, [account, ownerAddress])

  return <div>
    {connected
      ? <>
          <h3>Connected to MetaMask</h3>
          <div><b>Chain ID:</b> {chainId}</div>
          <div><b>Account:</b> {account}</div>
          <div><b>Balance:</b> {balance} ETH</div>
        </>
      : <>
          <button onClick={connect}>Connect to MetaMask</button>
        </>
    }

    <hr></hr>

    {contract
      ? <>
          <h3>Connected to Depositor</h3>
          <div><b>Owner address:</b> {ownerAddress} {isOwner && <b>(you)</b>}</div>
          <div><b>Balance:</b> {depositorBalance} ETH</div>

          {isOwner
            ? <>
                <input
                  type="text"
                  placeholder="Amount to withdrawal"
                  onBlur={(e) => {
                    const { value } = e.target;
                    if (!value) return
                    withdrawal(value)
                      .then(receipt => {
                        e.target.value = "";
                        alert(receipt?.transactionHash)
                      })
                      .catch(() => { e.target.disabled = true });
                  }}
                />
              </>
            : <>
                <input
                  type="text"
                  placeholder="Amount to deposit"
                  onBlur={(e) => {
                    const { value } = e.target;
                    if (!value) return
                    deposit(value)
                      .then(receipt => {
                        e.target.value = "";
                        alert(receipt?.transactionHash)
                      })
                      .catch(() => { e.target.disabled = true });
                  }}
                />
              </>
          }
        </>
      : <>
          <div>Depositor contract is not connected...</div>
        </>
    }
  </div>
}

const root = createRoot(document.querySelector("#app") as Element);
root.render(<React.StrictMode><App /></React.StrictMode>);