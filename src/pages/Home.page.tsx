import { FC, useContext, useEffect, useState } from "react";

// Api
import { CATEGORIES_API, RECIPES_API } from "../api";

// Assets
import wallpaperImg from "../assets/images/wallpaper.jpg";

// Components
import { BigCard, SmallCard } from "../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../providers";

// Types
import {
    CategoryT,
    LoaderContextI,
    RecipeT,
    SnackbarContextI,
    ThemeContextI,
} from "../types";

// Utilities
import { setPageTitle } from "../utilities";

const Home: FC = () => {
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [categories, setCategories] = useState<CategoryT[]>([]);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const [favouriteRecipes, setFavouriteRecipes] = useState<RecipeT[]>([]);
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;

    setPageTitle("Home");

    const isDarkMode: boolean = theme === "dark";

    async function getDataHandler() {
        setIsLoading(true);

        const categoriesRes = await CATEGORIES_API.getAllWithoutFilters();
        const recipesRes = await RECIPES_API.getFavourites();

        if (categoriesRes && categoriesRes.data)
            setCategories(categoriesRes.data);
        else activateSnackbar("Impossibile recuperare le categorie", "error");

        if (recipesRes) setFavouriteRecipes(recipesRes);
        else activateSnackbar("Impossibile recuperare i preferiti", "error");

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, []);

    const image = (
        <img
            src={wallpaperImg}
            alt="Impossibile visualizzare l'immagine."
            className="w-[80%] rounded-lg mobile:hidden"
        />
    );

    const mobileFavouriteRecipesComponent = favouriteRecipes.length > 0 && (
        <div
            className={`flex-col w-full transition-all duration-200 p-0 rounded-3xl hidden mobile:flex
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            <span
                className={`transition-all duration-200 text-3xl
                        ${isDarkMode ? "text-white" : "text-black"} 
                    `}
            >
                Ricette Preferite
            </span>
            <div className="flex flex-row items-center gap-10 overflow-x-scroll pt-10 w-full">
                {favouriteRecipes.map((favouriteRecipe: RecipeT) => (
                    <BigCard
                        key={favouriteRecipe.id}
                        title={favouriteRecipe.name}
                        backgroundImage={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${favouriteRecipe?.id}`}
                        time={favouriteRecipe.time}
                        path={`/recipes/${favouriteRecipe.id}`}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </div>
        </div>
    );

    const categoriesComponent = (
        <div className="flex flex-row gap-10 mobile:w-full mobile:flex-col">
            {categories.map((category: CategoryT) => (
                <SmallCard
                    key={category.id}
                    title={category.name}
                    backgroundImage={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${category.id}`}
                    path={`/categories/${category.id}`}
                />
            ))}
        </div>
    );

    const desktopFavouriteRecipesComponent = favouriteRecipes.length > 0 && (
        <div
            className={`flex flex-col w-full transition-all duration-200 p-10 rounded-3xl mobile:hidden
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            <span
                className={`transition-all duration-200 text-3xl
                        ${isDarkMode ? "text-white" : "text-black"} 
                    `}
            >
                Ricette Preferite
            </span>
            <div className="flex flex-row items-center gap-10 overflow-x-scroll pt-10">
                {favouriteRecipes.map((favouriteRecipe: RecipeT) => (
                    <BigCard
                        key={favouriteRecipe.id}
                        title={favouriteRecipe.name}
                        backgroundImage={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${favouriteRecipe?.id}`}
                        time={favouriteRecipe.time}
                        path={`/recipes/${favouriteRecipe.id}`}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col justify-center items-center pb-[30vh] gap-20 mobile:gap-40 mobile:pb-[70vh]">
            {image}
            {mobileFavouriteRecipesComponent}
            {categoriesComponent}
            {desktopFavouriteRecipesComponent}
        </div>
    );
};

export default Home;
