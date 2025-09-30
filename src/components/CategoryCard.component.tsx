import React, { FC } from "react";
import { useTranslation } from "react-i18next";

// Components
import LiquidGlass from "./LiquidGlass.component";

// Types
import { TCategory } from "../types";

export type TCategoryCard = TCategory & {
  totalRecipes: number;
};

interface IProps {
  data: TCategoryCard;
}

const CategoryCard: FC<IProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <LiquidGlass borderRadius={30} className="p-10 relative">
      <div className="flex flex-col gap-5">
        <div className="p-5 bg-white rounded-3xl flex justify-center items-center">
          <img
            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data.id}`}
            alt={t("imgNotFound")}
            className="w-60"
          />
        </div>
        <span className="text-white text-xl text-center">{data.label}</span>
        <span className="text-white text-3xl text-center">
          {data.totalRecipes}
        </span>
      </div>
    </LiquidGlass>
  );
};

export default CategoryCard;
