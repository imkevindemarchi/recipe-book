import { createContext, useState } from "react";

// Types
import { SidebarProviderI, SidebarContextI } from "../types";

export const SidebarContext = createContext<SidebarContextI | null>(null);

export const SidebarProvider = ({ children }: SidebarProviderI) => {
    const [state, setState] = useState<boolean>(false);

    function stateHandler(): void {
        setState(!state);
    }

    return (
        <SidebarContext.Provider value={{ state, stateHandler }}>
            {children}
        </SidebarContext.Provider>
    );
};
