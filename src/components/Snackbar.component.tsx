import { FC, MouseEvent } from "react";

// Assets
import { ErrorIcon, Verifiedicon, WarningIcon } from "../assets/icons";

// Types
import { SnackbarI } from "../types";

const Snackbar: FC<SnackbarI> = ({ state, onClose }) => {
    const { type, isOpen, message } = state;

    const isErrorType: boolean = type === "error";
    const isSuccessType: boolean = type === "success";
    const isWarningType: boolean = type === "warning";

    function closeHandler(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        onClose();
    }

    return (
        <div className="w-full z-[990] fixed left-0 flex justify-center items-center">
            <button
                onClick={closeHandler}
                className={`max-w-[30%] fixed z-[990] px-10 py-2 rounded-full flex flex-row gap-2 justify-center items-center transition-all top-5 text-white mobile:max-w-max
                    ${
                        isOpen
                            ? "right-5 opacity-100 mobile:right-auto"
                            : "right-[-50%] opacity-0"
                    } 
                    ${isErrorType && "bg-red"} 
                    ${isSuccessType && "bg-green"} 
                    ${isWarningType && "bg-orange"}
                `}
            >
                {isErrorType && <ErrorIcon className="text-xl" />}
                {isSuccessType && <Verifiedicon className="text-xl" />}
                {isWarningType && <WarningIcon className="text-xl" />}
                <span>{message}</span>
            </button>
        </div>
    );
};

export default Snackbar;
