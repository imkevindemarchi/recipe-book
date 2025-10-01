import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Assets
import { ClockIcon, PersonIcon } from "../assets/icons";

// Components
import LiquidGlass from "./LiquidGlass.component";
import Button from "./Button.component";

// Types
import { TRecipe } from "../types";

interface IProps {
  data: TRecipe;
}

const RecipeCard: FC<IProps> = ({ data }) => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  function onGoToRecipe(): void {
    navigate(`/recipes/${data.id}`);
  }

  const image: ReactNode = (
    <img
      src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${data.id}`}
      alt={t("imgNotFound")}
      className="rounded-3xl w-full h-full"
    />
  );

  const name: ReactNode = (
    <span className="text-ellipsis text-xl font-bold text-white">
      {data.name}
    </span>
  );

  const timeAndPeople: ReactNode = (data.time || data.people) && (
    <div className="w-full flex justify-between items-center">
      {data.time && (
        <div className="flex items-center gap-2">
          <ClockIcon className="text-white opacity-80" />
          <span className="text-white">{data.time}</span>
        </div>
      )}
      {data.people && (
        <div className="flex items-center gap-2">
          <PersonIcon className="text-white opacity-80" />
          <span className="text-white">{data.time}</span>
        </div>
      )}
    </div>
  );

  const button: ReactNode = (
    <Button
      variant="liquid-glass"
      text={t("viewRecipe")}
      onClick={onGoToRecipe}
    />
  );

  return (
    <LiquidGlass className="p-10 flex flex-col gap-5">
      {image}
      {name}
      {timeAndPeople}
      {button}
    </LiquidGlass>
  );
};

export default RecipeCard;
