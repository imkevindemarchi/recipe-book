import {
    ChangeEvent,
    FC,
    LegacyRef,
    memo,
    useEffect,
    useRef,
    useState,
} from "react";

// Hooks
import { useClickOutside } from "../hooks";

// Types
import { AutocompleteI, OptionT } from "../types";

// Utilities
import { filterArrayByString } from "../utilities";

const Autocomplete: FC<AutocompleteI> = ({
    placeholder,
    type = "text",
    value,
    onChange,
    error,
    disabled,
    startIcon,
    endIcon,
    name,
    isDarkMode,
    options,
}) => {
    const inputRef: LegacyRef<HTMLInputElement> = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string | undefined>(
        value?.value
    );
    const [elabOptions, setElabOptions] = useState<OptionT[]>([]);

    useClickOutside(inputRef, () => setIsMenuOpen(false));

    useEffect(() => {
        if (value) setInputValue(value.value);
    }, [value]);

    useEffect(() => {
        if (inputValue) {
            const filteredOptions: OptionT[] = filterArrayByString(
                options,
                inputValue
            );

            setElabOptions(filteredOptions);
        }
    }, [inputValue, options]);

    const Menu = memo(({ elabOptions }: { elabOptions: OptionT[] }) => {
        return isMenuOpen && inputValue && inputValue?.length > 0 ? (
            <div
                className={`absolute bottom-[-170px] w-full left-0 rounded-lg h-40 overflow-y-scroll transition-all duration-200
                    ${isDarkMode ? "bg-black" : "bg-white"}
                `}
            >
                {elabOptions.map((option: OptionT) => (
                    <div
                        key={option.key}
                        onClick={() => {
                            onChange(option);
                            setIsMenuOpen(false);
                        }}
                        className={`transition-all duration-200 p-3 cursor-pointer
                            ${
                                isDarkMode
                                    ? "hover:bg-darkgray"
                                    : "hover:bg-gray-200"
                            }
                        `}
                    >
                        <span
                            className={`transition-all duration-200
                                ${isDarkMode ? "text-white" : "text-black"}
                            `}
                        >
                            {option.value}
                        </span>
                    </div>
                ))}
            </div>
        ) : null;
    });

    function inputHandler(event: ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    const inputComponent = (
        <div
            className={`w-full px-5 py-4 rounded-lg flex flex-row gap-5 items-center relative
                ${
                    !disabled
                        ? isDarkMode
                            ? "bg-black"
                            : "bg-white"
                        : "bg-gray-200 cursor-not-allowed"
                }
            `}
        >
            {startIcon && <div className="text-gray-400">{startIcon}</div>}
            <input
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                value={inputValue}
                onChange={inputHandler}
                onClick={() => setIsMenuOpen(true)}
                disabled={disabled}
                name={name}
                className={`w-full border-none outline-none bg-transparent
                    ${isDarkMode ? "text-white" : "text-black"}
                    ${disabled && "cursor-not-allowed"}
                `}
            />
            {endIcon && <div className="text-gray-400">{endIcon}</div>}
            {<Menu elabOptions={elabOptions} />}
        </div>
    );

    const errorComponent = error?.value && (
        <span className="text-red">{error?.message}</span>
    );

    return (
        <div className="w-full flex flex-col gap-2">
            {inputComponent}
            {errorComponent}
        </div>
    );
};

export default Autocomplete;
