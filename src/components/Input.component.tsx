import React, { ChangeEvent, FC, ReactElement, useEffect, useRef } from "react";

// Components
import LiquidGlass from "./LiquidGlass.component";

// Types
import { TValidation } from "../utils/validation.util";

type TInputType = "text" | "password";

type TInputAutoComplete = "email" | "current-password";

interface IProps {
  autoFocus?: boolean;
  placeholder: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  type?: TInputType;
  name?: string;
  value: any;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoComplete?: TInputAutoComplete;
  error?: TValidation;
}

const Input: FC<IProps> = ({
  type = "text",
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
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  function onFocus() {
    if (inputRef.current)
      inputRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  }

  function onBlur() {
    if (inputRef.current)
      inputRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  }

  useEffect(() => {
    autoFocus && onFocus();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <LiquidGlass
        ref={inputRef}
        className={`flex flex-col gap-2 px-5 py-3 ${className}`}
      >
        <div className="flex flex-row gap-2 items-center">
          {startIcon}
          <input
            value={value}
            name={name}
            type={type}
            autoFocus={autoFocus}
            style={{ background: "transparent" }}
            className="border-none outline-none text-base text-white w-full"
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event)}
            autoComplete={autoComplete}
          />
          {endIcon}
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

export default Input;
