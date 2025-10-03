import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Grid } from "@mui/material";

// Api
import { RECIPE_API } from "../api";

// Assets
import { BookMarkFilledIcon, BookMarkIcon, SadIcon } from "../assets/icons";

// Components
import {
  GoBackButton,
  IngredientCard,
  LiquidGlass,
  Stepper,
} from "../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { THTTPResponse, TRecipe, TRecipeIngredient } from "../types";

// Utils
import { setPageTitle } from "../utils";

const Recipe: FC = () => {
  const [recipe, setRecipe] = useState<TRecipe | null>(null);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { recipeId } = useParams();

  const { t } = useTranslation();

  setPageTitle(recipe?.name as string);

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(RECIPE_API.get(recipeId as string)).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setRecipe(response.data);
        else openPopup(t("unableLoadRecipe"), "error");
      }
    );

    setIsLoading(false);
  }

  async function onFavouriteHandler(): Promise<void> {
    const data: TRecipe = {
      ...(recipe as TRecipe),
      isFavourite: !recipe?.isFavourite,
    };

    await Promise.resolve(RECIPE_API.update(data, recipeId as string)).then(
      async (recipeRes: THTTPResponse) => {
        if (recipeRes && recipeRes.hasSuccess)
          await Promise.resolve(RECIPE_API.get(recipeId as string)).then(
            (response: THTTPResponse) => {
              if (response && response.hasSuccess) setRecipe(response.data);
              else openPopup(t("unableLoadRecipe"), "error");
            }
          );
        else openPopup(t("unableUpdateRecipe"), "error");
      }
    );
  }

  const goBackButton: ReactNode = <GoBackButton />;

  const image: ReactNode = (
    <div className="h-72 desktop:h-96 overflow-hidden rounded-t-[50px] relative mobile:h-40">
      <img
        src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${recipe?.id}`}
        alt={t("imgNotFound")}
        className="w-full h-full object-cover blur-md"
      />
      <div
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="absolute flex justify-center items-center w-full h-full"
      >
        <LiquidGlass blur={30} className="px-10 py-5 mobile:px-5 mobile:py-2">
          <span
            className={`font-bold text-white uppercase text-3xl ${
              (recipe?.name?.length as number) > 20
                ? "mobile:text-lg"
                : "mobile:text-xl"
            }`}
          >
            {recipe?.name}
          </span>
        </LiquidGlass>
      </div>
    </div>
  );

  const bookMark: ReactNode = (
    <LiquidGlass
      blur={30}
      onClick={onFavouriteHandler}
      className="absolute right-10 desktop:mt-[-10vh] mt-[-13vh] w-16 h-16 flex justify-center items-center cursor-pointer hover:opacity-50 mobile:right-5 mobile:w-14 mobile:h-14 mobile:mt-5"
    >
      {recipe?.isFavourite ? (
        <BookMarkFilledIcon className="text-white text-[3em] mobile:text-3xl" />
      ) : (
        <BookMarkIcon className="text-white text-[3em] mobile:text-3xl" />
      )}
    </LiquidGlass>
  );

  const ingredients: ReactNode = (
    <div className="w-full flex flex-col gap-5">
      <span className="text-white text-3xl font-bold">{t("ingredients")}</span>
      <LiquidGlass className="max-h-[50vh] overflow-y-scroll flex flex-col gap-5 p-5 mobile:w-full">
        {recipe?.ingredients && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map(
            (ingredient: TRecipeIngredient, index: number) => {
              return <IngredientCard key={index} data={ingredient} />;
            }
          )
        ) : (
          <div className="w-full flex justify-center items-center gap-5">
            <SadIcon className="text-[3em] text-white" />
            <span className="text-white text-sm">
              {t("noAvailableIngredients")}
            </span>
          </div>
        )}
      </LiquidGlass>
    </div>
  );

  const stepper: ReactNode = (
    <div className="w-full h-full flex flex-col gap-5">
      <span className="text-white text-3xl font-bold">{t("procedure")}</span>
      <Stepper steps={recipe?.procedure as string[]} />
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        {goBackButton}
        <div className="relative">
          {image}
          {bookMark}
        </div>
      </div>
      <Grid container columnSpacing={5} rowSpacing={5}>
        <Grid size={{ xs: 12, md: 4, xl: 3 }}>{ingredients}</Grid>
        <Grid size={{ xs: 12, md: 8, xl: 9 }}>{stepper}</Grid>
      </Grid>
    </div>
  );
};

export default Recipe;
