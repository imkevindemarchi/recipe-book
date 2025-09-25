import React, { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

// Assets
import "./index.css";
import "./i18n.ts";

// Components
import App from "./App";

// Providers
import { LoaderProvider, PopupProvider } from "./providers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const app: ReactNode = (
  <StrictMode>
    <BrowserRouter>
      <PopupProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </PopupProvider>
    </BrowserRouter>
  </StrictMode>
);

root.render(app);
