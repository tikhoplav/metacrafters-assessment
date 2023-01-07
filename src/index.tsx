import * as React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <div>
    Hello, from React!!
  </div>
}

const root = createRoot(document.querySelector("#app") as Element);
root.render(<App />);