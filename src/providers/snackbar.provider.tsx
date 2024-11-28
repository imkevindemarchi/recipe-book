import { createContext, useState } from "react";

// Types
import {
    SnackbarContextI,
    SnackbarMessageT,
    SnackbarProviderI,
    SnackbarStateI,
} from "../types";

export const SnackbarContext = createContext<SnackbarContextI | null>(null);

export const SnackbarProvider = ({ children }: SnackbarProviderI) => {
    const [state, setState] = useState<SnackbarStateI>({
        isOpen: false,
        message: "",
        type: "error",
    });

    function closeHandler(): void {
        setState((prevState) => ({ ...prevState, isOpen: false }));

        setTimeout(() => {
            setState((prevState) => ({
                ...prevState,
                message: null,
                type: null,
            }));
        }, 1000);
    }

    function activateHandler(message: string, type: SnackbarMessageT) {
        setState({
            isOpen: true,
            message,
            type,
        });

        setTimeout(() => {
            closeHandler();
        }, 3000);
    }

    return (
        <SnackbarContext.Provider
            value={{ state, activateHandler, closeHandler }}
        >
            {children}
        </SnackbarContext.Provider>
    );
};
