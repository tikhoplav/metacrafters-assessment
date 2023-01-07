import * as React from "react";
import { createRoot } from "react-dom/client";
import useMetaMask from "./useMetaMask";

const App = () => {
  const { connect, connected, account, balance, chainId } = useMetaMask();

  return <div>
    {connected
      ? <>
          <div>Connected to MetaMask</div>
          <div><b>Chain ID:</b> {chainId}</div>
          <div><b>Account:</b> {account}</div>
          <div><b>Balance:</b> {balance}</div>
        </>
      : <>
          <button onClick={connect}>Connect to MetaMask</button>
        </>
    }
  </div>
}

const root = createRoot(document.querySelector("#app") as Element);
root.render(<App />);