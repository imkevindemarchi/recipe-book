import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Api
import { CATEGORIES_API, RECIPES_API } from "../api";

// Components
import { Card, BigCard, GoBackBtn } from "../components";

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

const Category: FC = () => {
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [category, setCategory] = useState<CategoryT | null>(null);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { id } = useParams();
    const [recipes, setRecipes] = useState<RecipeT[]>([]);
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;

    setPageTitle(category?.name || "");

    const isDarkMode: boolean = theme === "dark";

    async function getDataHandler() {
        setIsLoading(true);

        if (id) {
            const categoryRes = await CATEGORIES_API.get(id);

            if (categoryRes) {
                setCategory(categoryRes);
                const recipesRes = await RECIPES_API.getByCategory(
                    categoryRes.name
                );

                if (recipesRes) setRecipes(recipesRes);
                else {
                    activateSnackbar(
                        "Impossibile recuperare le ricette",
                        "error"
                    );
                }
            } else {
                activateSnackbar(
                    "Impossibile recuperare la categoria",
                    "error"
                );
            }
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, []);

    const goBackBtn = <GoBackBtn isDarkMode={isDarkMode} />;

    const image = (
        <img
            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${category?.id}`}
            alt="Impossibile visualizzare l'immagine."
            className="w-full h-60 rounded-lg blur-sm"
        />
    );

    const title = (
        <span className="text-white absolute font-bold uppercase text-3xl">
            {category?.name}
        </span>
    );

    const cards = (
        <Card>
            {recipes && recipes.length > 0 ? (
                <div className="flex flex-row flex-wrap gap-10 mobile:gap-0 mobile:justify-between">
                    {recipes.map((recipe: RecipeT, index: number) => (
                        <BigCard
                            key={recipe.id}
                            title={recipe.name}
                            backgroundImage={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${recipe?.id}`}
                            time={recipe.time}
                            path={`/recipes/${recipe.id}`}
                            isDarkMode={isDarkMode}
                            className={`w-40 h-[300px] mobile:w-36 mobile:h-[250px] bg-white rounded-xl relative cursor-pointer transition-all duration-200 hover:opacity-80 mobile:flex-shrink-0
                                ${index !== 0 && index !== 1 && "mobile:mt-10"}
                            `}
                            titleClassName="text-xs"
                        />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center">
                    <span
                        className={`transition-all duration-200 text-lg
                            ${isDarkMode ? "text-white" : " text-black"}
                        `}
                    >
                        Nessuna ricetta disponibile
                    </span>
                </div>
            )}
        </Card>
    );

    return (
        <div className="flex flex-col justify-center items-center pb-[30vh] gap-10 mobile:gap-10 mobile:pb-[100vh]">
            <div className="relative w-full flex justify-center items-center">
                {image}
                {title}
            </div>
            {goBackBtn}
            {cards}
        </div>
    );
};

export default Category;
