import { FC, MouseEvent } from "react";

// Types
import { ButtonI } from "../types";

const Button: FC<ButtonI> = ({
    type = "button",
    disabled,
    onClick,
    children,
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                onClick && onClick(event);
            }}
            className={`w-full py-3 rounded-lg border-none outline-none 
                ${
                    disabled
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-primary hover:opacity-80 transition-all duration-200"
                }
            `}
        >
            {children}
        </button>
    );
};

export default Button;
