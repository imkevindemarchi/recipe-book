import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

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

const CategoryCard: FC<IProps> = ({ data, ...props }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  function onGoToCategoryPage(): void {
    navigate(`/categories/${data.id}`);
  }

  return (
    <LiquidGlass
      onClick={onGoToCategoryPage}
      borderRadius={30}
      className="p-10  relative mobile:p-5 cursor-pointer hover:opacity-50"
      {...props}
    >
      <div className="flex flex-col gap-5 w-full h-full">
        <LiquidGlass
          borderRadius={30}
          className="p-5 bg-white rounded-3xl flex justify-center items-center h-40 w-40 mobile:w-[20vh] mobile:h-full"
        >
          <img
            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data.id}`}
            alt={t("imgNotFound")}
            className="w-full h-full"
          />
        </LiquidGlass>
        <span className="text-white text-xl text-center mobile:text-xl">
          {data.label}
        </span>
        <span className="text-white text-3xl text-center mobile:text-2xl">
          {data.totalRecipes}
        </span>
      </div>
    </LiquidGlass>
  );
};

export default CategoryCard;
