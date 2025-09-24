import React, { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

// Assets
import "./index.css";

// Components
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const app: ReactNode = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

root.render(app);
