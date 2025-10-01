import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";

// Api
import { RECIPE_API } from "../api";

// Assets
import { SadIcon, SearchIcon } from "../assets/icons";

// Components
import { Input, RecipeCard } from "../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { THTTPResponse, TRecipe } from "../types";

// Utils
import { setPageTitle, sortArray } from "../utils";

const Recipes: FC = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<TRecipe[]>([]);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [filter, setFilter] = useState<string | null>(null);

  setPageTitle(t("recipes"));

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

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(RECIPE_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) {
          setRecipes(response.data);
        } else openPopup(t("unableLoadRecipes"), "error");
      }
    );

    setIsLoading(false);
  }

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
      {input}
      {filteredRecipes.length > 0 ? list : noData}
    </div>
  );
};

export default Recipes;
