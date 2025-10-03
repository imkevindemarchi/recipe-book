import React, { FC } from "react";

// Components
import LiquidGlass from "./LiquidGlass.component";

// Types
import { TRecipeIngredient } from "../types";

interface IProps {
  data: TRecipeIngredient;
}

const IngredientCard: FC<IProps> = ({ data, ...props }) => {
  return (
    <LiquidGlass
      borderRadius={50}
      className="flex flex-col px-5 py-2"
      {...props}
    >
      <div className="flex items-center gap-2 whitespace-nowrap flex-wrap">
        <span className="text-white text-2xl">{data.icon}</span>
        <span className="text-white">{data.quantity}</span>
        <span className="text-white">{data.label}</span>
      </div>
    </LiquidGlass>
  );
};

export default IngredientCard;
