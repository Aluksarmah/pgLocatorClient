import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { ContextProvider } from "./UserContext.jsx";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ContextProvider>
  </React.StrictMode>
);
