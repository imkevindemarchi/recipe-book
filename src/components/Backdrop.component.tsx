import { FC } from "react";

// Types
import { BackdropI } from "../types";

const Backdrop: FC<BackdropI> = ({ isOpen, onClose, isDarkMode, children }) => {
    return isOpen ? (
        <div
            onClick={onClose}
            className={`fixed top-0 left-0 w-full h-[100vh] z-[40] flex justify-center items-center transition-all duration-200
                ${onClose && "cursor-pointer"}
                ${isDarkMode ? "bg-backdrop-dark" : "bg-backdrop"}
            `}
        >
            {children}
        </div>
    ) : null;
};

export default Backdrop;
