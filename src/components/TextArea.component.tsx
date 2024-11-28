import { FC } from "react";

// Types
import { TextAreaI } from "../types";

const TextArea: FC<TextAreaI> = ({
    placeholder,
    value,
    onChange,
    error,
    disabled,
    name,
    isDarkMode,
}) => {
    const textAreaComponent = (
        <div
            className={`w-full px-5 py-4 rounded-lg flex flex-row gap-5 items-center
                ${
                    !disabled
                        ? isDarkMode
                            ? "bg-black"
                            : "bg-white"
                        : "bg-gray-200 cursor-not-allowed"
                }
            `}
        >
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}
                className={`w-full border-none outline-none bg-transparent h-40
                    ${isDarkMode ? "text-white" : "text-black"}
                    ${disabled && "cursor-not-allowed"}
                `}
            />
        </div>
    );

    const errorComponent = <span className="text-red">{error?.message}</span>;

    return (
        <div className="w-full flex flex-col gap-2">
            {textAreaComponent}
            {error?.value && errorComponent}
        </div>
    );
};

export default TextArea;
