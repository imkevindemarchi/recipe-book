import React, { FC, MouseEvent } from "react";

// Components
import LiquidGlass from "./LiquidGlass.component";

type TVariant = "primary" | "liquid-glass";

type TButtonType = "button" | "submit" | "reset";

interface IProps {
  variant: TVariant;
  text: string;
  type?: TButtonType;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<IProps> = ({
  variant = "primary",
  type = "button",
  text,
  onClick,
}) => {
  switch (variant) {
    case "liquid-glass": {
      return (
        <LiquidGlass>
          <button
            onClick={onClick}
            type={type}
            className="px-10 py-3 w-full flex justify-center items-center hover:opacity-50 transition-all duration-300"
          >
            <span className="text-base text-white">{text}</span>
          </button>
        </LiquidGlass>
      );
    }
    default: {
      return (
        <button
          onClick={onClick}
          type={type}
          className="bg-primary rounded-full px-5 py-3 hover:opacity-50 transition-all duration-300"
        >
          <span className="text-base text-white">{text}</span>
        </button>
      );
    }
  }
};

export default Button;
