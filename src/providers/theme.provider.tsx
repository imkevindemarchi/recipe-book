import { createContext, useState } from "react";

// Types
import { ThemeContextI, ThemeProviderI, ThemeT } from "../types";

// Utilities
import { getFromStorage, setToStorage } from "../utilities";

export const ThemeContext = createContext<ThemeContextI | null>(null);

export const ThemeProvider = ({ children }: ThemeProviderI) => {
    const [state, setState] = useState<ThemeT>(
        getFromStorage("theme") || "light"
    );

    function stateHandler(): void {
        const themeToChange: ThemeT = state === "light" ? "dark" : "light";
        setState(themeToChange);
        setToStorage("theme", themeToChange);
    }

    return (
        <ThemeContext.Provider value={{ state, stateHandler }}>
            {children}
        </ThemeContext.Provider>
    );
};
