import React, { FC, ReactNode, RefObject } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
  onClick?: () => void;
  noBorder?: boolean;
}

const LiquidGlass: FC<IProps> = ({
  className,
  ref,
  onClick,
  noBorder = false,
  children,
}) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        border: noBorder ? "" : "1px solid rgba(255, 255, 255, 0.25)",
        borderRadius: 50,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.10)",
        backdropFilter: "blur(2px)",
      }}
      className={`transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default LiquidGlass;
