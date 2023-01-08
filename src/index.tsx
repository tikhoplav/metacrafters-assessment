import * as React from "react";
import { createRoot } from "react-dom/client";
import useDepositor from "./useDepositor";
import useMetaMask from "./useMetaMask";

const App = () => {
  const { connect, connected, account, balance, chainId } = useMetaMask();
  const { contract, ownerAddress, balance: depositorBalance } = useDepositor({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  });

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
          <div><b>Owner address:</b> {ownerAddress} {ownerAddress === account && <b>(you)</b>}</div>
          <div><b>Balance:</b> {depositorBalance} ETH</div>
        </>
      : <>
          <div>Depositor contract is not connected...</div>
        </>
    }
  </div>
}

const root = createRoot(document.querySelector("#app") as Element);
root.render(<App />);