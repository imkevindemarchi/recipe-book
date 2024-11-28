import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// Assets
import "./index.css";

// Components
import App from "./App";

// Providers
import {
    AuthProvider,
    LoaderProvider,
    SidebarProvider,
    SnackbarProvider,
    ThemeProvider,
} from "./providers";

const root = createRoot(document.getElementById("root") as HTMLElement);

const app = (
    <StrictMode>
        <Router>
            <SnackbarProvider>
                <AuthProvider>
                    <LoaderProvider>
                        <ThemeProvider>
                            <SidebarProvider>
                                <App />
                            </SidebarProvider>
                        </ThemeProvider>
                    </LoaderProvider>
                </AuthProvider>
            </SnackbarProvider>
        </Router>
    </StrictMode>
);

root.render(app);
