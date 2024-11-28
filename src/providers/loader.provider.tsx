import { createContext, useState } from "react";

// Types
import { LoaderContextI, LoaderProviderI } from "../types";

export const LoaderContext = createContext<LoaderContextI | null>(null);

export const LoaderProvider = ({ children }: LoaderProviderI) => {
    const [state, setState] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ state, setState }}>
            {children}
        </LoaderContext.Provider>
    );
};
