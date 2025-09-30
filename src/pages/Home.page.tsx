import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Api
import { CATEGORY_API, RECIPE_API } from "../api";

// Assets
import sushiImg from "../assets/images/sushi.png";

// Components
import { Button } from "../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import CategoryCard, {
  TCategoryCard,
} from "../components/CategoryCard.component";
import { TCategory, THTTPResponse, TRecipe } from "../types";

// Utils
import { setPageTitle } from "../utils";

const Home: FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<TCategoryCard[]>([]);
  const navigate: NavigateFunction = useNavigate();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  setPageTitle(t("home"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([CATEGORY_API.getAll(), RECIPE_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess) {
          if (response[1] && response[1].hasSuccess) {
            const elabCategories: TCategoryCard[] = response[0].data.map(
              (category: TCategory) => {
                const totalRecipes: number = response[1].data.filter(
                  (recipe: TRecipe) => recipe.category?.id === category.id
                ).length;

                return { ...category, totalRecipes };
              }
            );

            setCategories(elabCategories);
          } else openPopup(t("unableLoadRecipes"), "error");
        } else openPopup(t("unableLoadCategories"), "error");
      }
    );

    setIsLoading(false);
  }

  function onGoToRecipes(): void {
    navigate("/recipes");
  }

  const image: ReactNode = (
    <img
      src={sushiImg}
      alt={t("imgNotFound")}
      className="w-[30%] mobile:w-[80%]"
    />
  );

  const categoriesComponent: ReactNode = (
    <div className="flex justify-between mt-60 gap-20 items-center">
      {categories.map((category: TCategoryCard, index: number) => {
        return <CategoryCard key={index} data={category} />;
      })}
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[3em]  text-white font-bold transition-all duration-300">
            {process.env.REACT_APP_WEBSITE_NAME}
          </span>
          <div className="py-20">
            <span className="transition-all text-white duration-300">
              {t("homeDescription")}
            </span>
          </div>
          <Button
            variant="liquid-glass"
            text={t("exploreRecipes")}
            onClick={onGoToRecipes}
            className="w-fit"
          />
        </div>
        {image}
      </div>
      {categoriesComponent}
    </div>
  );
};

export default Home;
