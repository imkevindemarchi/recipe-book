import React, { FC, ReactNode, RefObject } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
  onClick?: (event: any) => void;
  noBorder?: boolean;
  borderRadius?: number;
  borderBottomRadius?: number;
  blur?: number;
  backgroundColor?: string;
  borderColor?: string;
  zIndex?: number;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: any) => void;
  onDrop?: () => void;
}

const LiquidGlass: FC<IProps> = ({
  className,
  ref,
  onClick,
  noBorder = false,
  children,
  borderRadius = 50,
  borderBottomRadius,
  blur = 2,
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  borderColor = "rgba(255, 255, 255, 0.25)",
  zIndex = 0,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div
      ref={ref}
      onClick={onClick && onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        background: backgroundColor,
        border: noBorder ? "" : `1px solid ${borderColor}`,
        borderRadius,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.10)",
        backdropFilter: `blur(${blur}px)`,
        borderBottomLeftRadius: borderBottomRadius || borderRadius,
        borderBottomRightRadius: borderBottomRadius || borderRadius,
        zIndex,
      }}
      className={`transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default LiquidGlass;
