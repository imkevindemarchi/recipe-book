import { FC, MouseEvent } from "react";

// Assets
import { CancelIcon } from "../assets/icons";

// Components
import Backdrop from "./Backdrop.component";
import IconButton from "./IconButton.component";

// Types
import { ModalI } from "../types";

const Modal: FC<ModalI> = ({
    title,
    isOpen,
    onClose,
    isDarkMode,
    submitBtnText,
    cancelBtnText,
    submitHandler,
    children,
}) => {
    function closeHandler(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        onClose();
    }

    const modal = (
        <div
            className={`transition-all duration-200 p-10 rounded-3xl flex flex-col gap-10 max-w-[40%] mobile:max-w-[95%] mobile:p-5
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            <div className="flex justify-between">
                <span
                    className={`transition-all duration-200 text-3xl mobile:text-2xl font-bold
                        ${isDarkMode ? "text-white" : "text-black"}
                    `}
                >
                    {title}
                </span>
                <IconButton
                    onClick={closeHandler}
                    className="mobile:h-14 mobile:w-14 mobile:flex mobile:justify-center mobile:items-center"
                >
                    <CancelIcon
                        className={`text-xl transition-all duration-200
                            ${isDarkMode ? "text-white" : "text-black"}
                        `}
                    />
                </IconButton>
            </div>
            {children}
            <div className="flex justify-end">
                <div className="flex flex-row gap-5">
                    <button
                        onClick={closeHandler}
                        className={`px-8 py-3 transition-all duration-200 hover:opacity-50 rounded-full
                            ${isDarkMode ? "bg-darkgray" : "bg-gray-200"}
                        `}
                    >
                        <span
                            className={`transition-all duration-200 text-lg
                                ${isDarkMode ? "text-white" : "text-black"}
                            `}
                        >
                            {cancelBtnText}
                        </span>
                    </button>
                    <button
                        onClick={(event: MouseEvent<HTMLButtonElement>) =>
                            submitHandler(event)
                        }
                        className="bg-primary px-8 py-3 transition-all duration-200 hover:opacity-50 rounded-full"
                    >
                        <span className="text-white text-lg">
                            {submitBtnText}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

    return isOpen ? (
        <Backdrop isOpen={isOpen} isDarkMode={isDarkMode}>
            {modal}
        </Backdrop>
    ) : null;
};

export default Modal;
