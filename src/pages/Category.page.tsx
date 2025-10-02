import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Grid } from "@mui/material";

// Api
import { CATEGORY_API, RECIPE_API } from "../api";

// Assets
import { SadIcon, SearchIcon } from "../assets/icons";

// Components
import { Input, RecipeCard } from "../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { TCategory, THTTPResponse, TRecipe } from "../types";

// Utils
import { setPageTitle, sortArray } from "../utils";

const Category: FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<TCategory | null>(null);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { categoryId } = useParams();
  const [recipes, setRecipes] = useState<TRecipe[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredRecipes: TRecipe[] = sortArray(
    recipes.filter((recipe: TRecipe) => {
      return (
        !filter ||
        filter.trim() === "" ||
        recipe.name
          ?.toLowerCase()
          ?.trim()
          ?.includes(filter?.toLowerCase()?.trim() as string)
      );
    }),
    "name"
  );

  setPageTitle(category?.label as string);

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([
      RECIPE_API.getAll(),
      CATEGORY_API.get(categoryId as string),
    ]).then((response: THTTPResponse[]) => {
      if (response[0] && response[0].hasSuccess) {
        const recipes: TRecipe[] = response[0].data.filter(
          (recipe: TRecipe) => {
            return recipe.category?.id === categoryId;
          }
        );

        setRecipes(recipes);
      } else openPopup(t("unableLoadRecipes"), "error");

      if (response[1] && response[1].hasSuccess) setCategory(response[1].data);
      else openPopup(t("unableLoadCategory"), "error");
    });

    setIsLoading(false);
  }

  const title: ReactNode = (
    <span className="text-white text-3xl">{category?.label}</span>
  );

  const input: ReactNode = (
    <Input
      autoFocus
      value={filter}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setFilter(event.target.value)
      }
      startIcon={<SearchIcon className="text-white text-2xl" />}
      placeholder={t("name")}
    />
  );

  const list: ReactNode = (
    <Grid container columnSpacing={5} rowSpacing={5}>
      {filteredRecipes.map((recipe: TRecipe, index: number) => {
        return (
          <Grid key={index} size={{ xs: 12, md: 3 }}>
            <RecipeCard data={recipe} />
          </Grid>
        );
      })}
    </Grid>
  );

  const noData: ReactNode = (
    <div className="min-h-60 w-full flex justify-center items-center">
      <div className="w-full flex justify-center items-center gap-2">
        <SadIcon className="text-[3em] text-white" />
        <span className="text-white text-xl">{t("noData")}</span>
      </div>
    </div>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {title}
      {input}
      {filteredRecipes.length > 0 ? list : noData}
    </div>
  );
};

export default Category;
