import React, { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

// Assets
import "./index.css";
import "./i18n.ts";

// Components
import App from "./App";

// Providers
import { AuthProvider, LoaderProvider, PopupProvider } from "./providers";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const app: ReactNode = (
  <StrictMode>
    <BrowserRouter>
      <PopupProvider>
        <LoaderProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LoaderProvider>
      </PopupProvider>
    </BrowserRouter>
  </StrictMode>
);

root.render(app);
