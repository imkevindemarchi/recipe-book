import React, {
  ChangeEvent,
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

// Components
import LiquidGlass from "./LiquidGlass.component";

// Spinner
import { ClipLoader as Spinner } from "react-spinners";

// Types
import { TValidation } from "../utils/validation.util";

type TInputAutoComplete = "email" | "current-password";

interface IProps {
  autoFocus?: boolean;
  placeholder: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  name?: string;
  value: any;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  autoComplete?: TInputAutoComplete;
  error?: TValidation;
  onSearch?: () => Promise<void>;
}

const Textarea: FC<IProps> = ({
  autoFocus = false,
  placeholder,
  startIcon,
  name,
  value,
  onChange,
  className,
  endIcon,
  autoComplete,
  error = { isValid: true },
  onSearch,
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [isValueChanged, setIsValueChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onFocus() {
    if (inputRef.current)
      inputRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  }

  function onBlur() {
    if (inputRef.current)
      inputRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  }

  useEffect(() => {
    const timeOut: NodeJS.Timeout = setTimeout(async () => {
      if (isValueChanged && onSearch) {
        await onSearch();
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeOut);

    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    autoFocus && onFocus();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <LiquidGlass
        ref={inputRef}
        className={`flex flex-col gap-2 p-10 ${className}`}
      >
        <div className="flex flex-row gap-2 items-center">
          {startIcon}
          <textarea
            value={value || ""}
            name={name}
            autoFocus={autoFocus}
            style={{ background: "transparent", minHeight: 150 }}
            className="border-none outline-none text-base text-white w-full"
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              onChange(event);
              if (onSearch) {
                setIsValueChanged(true);
                setIsLoading(true);
              }
            }}
            autoComplete={autoComplete}
          />
          {endIcon}
          {isLoading && <Spinner size={20} color="#ffffff" className="ml-2" />}
        </div>
      </LiquidGlass>
      {!error?.isValid && (
        <LiquidGlass
          className="py-2 px-3"
          backgroundColor="rgba(255, 41, 0, 0.3)"
          borderColor="rgba(255, 41, 0, 0.3)"
        >
          <span className="text-white">{error?.message}</span>
        </LiquidGlass>
      )}
    </div>
  );
};

export default Textarea;
