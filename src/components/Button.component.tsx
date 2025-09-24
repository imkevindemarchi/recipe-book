import React, { FC } from "react";

type TButtonType = "button" | "submit" | "reset";

interface IProps {
  text: string;
  type?: TButtonType;
}

const Button: FC<IProps> = ({ type = "button", text }) => {
  return (
    <button type={type} className="bg-primary rounded-full px-5 py-3">
      <span className="text-base text-white">{text}</span>
    </button>
  );
};

export default Button;
