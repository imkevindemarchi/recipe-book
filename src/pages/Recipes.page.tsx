import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Api
import { RECIPES_API } from "../api";

// Assets
import { CancelIcon } from "../assets/icons";

// Components
import { BigCard, Card, IconButton, Input } from "../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../providers";

// Types
import {
    LoaderContextI,
    RecipeT,
    SnackbarContextI,
    ThemeContextI,
} from "../types";

// Utilities
import { setPageTitle } from "../utilities";

interface FormDataI {
    name: string;
}

const Recipes: FC = () => {
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [recipes, setRecipes] = useState<RecipeT[]>([]);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;
    const [searchParams, setSearchParams] = useSearchParams({});
    const [formData, setFormData] = useState<FormDataI>({
        name: searchParams.get("name") || "",
    });

    setPageTitle("Ricette");

    const isDarkMode: boolean = theme === "dark";

    async function getDataHandler() {
        setIsLoading(true);

        const res = await RECIPES_API.getByName(formData.name);

        if (res && res.data) setRecipes(res.data);
        else activateSnackbar("Impossibile recuperare le ricette", "error");

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, [formData.name]);

    const title = (
        <span
            className={`transition-all duration-200 text-3xl hidden mobile:block
                ${isDarkMode ? "text-white" : "text-black"} 
            `}
        >
            Ricette
        </span>
    );

    function inputHandler(event: ChangeEvent<HTMLInputElement>): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));

        setSearchParams({
            name: value,
        });
    }

    function resetHandler(): void {
        setFormData({ name: "" });
    }

    const form = (
        <Card>
            <div className="flex gap-5 flex-row">
                <div className="w-[30vh] mobile:w-full">
                    <Input
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={inputHandler}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <IconButton
                    onClick={resetHandler}
                    className="w-14 h-14 flex justify-center items-center"
                >
                    <CancelIcon
                        className={isDarkMode ? "text-white" : "text-black"}
                    />
                </IconButton>
            </div>
        </Card>
    );

    const recipesComponent = (
        <div className="flex flex-row flex-wrap gap-10 mobile:gap-0 mobile:justify-between">
            {recipes.map((recipe: RecipeT, index: number) => (
                <BigCard
                    key={recipe.id}
                    title={recipe.name}
                    backgroundImage={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${recipe?.id}`}
                    time={recipe.time}
                    path={`/recipes/${recipe.id}`}
                    isDarkMode={isDarkMode}
                    className={`w-40 h-[300px] bg-white rounded-xl relative cursor-pointer transition-all duration-200 hover:opacity-80 mobile:flex-shrink-0 
                        ${index !== 0 && index !== 1 && "mobile:mt-10"}
                    `}
                    titleClassName="text-xs"
                />
            ))}
        </div>
    );

    const noData = (
        <div className="flex justify-center">
            <span
                className={`transition-all duration-200 text-lg
                    ${isDarkMode ? "text-white" : " text-black"}
                `}
            >
                Nessuna ricetta disponibile
            </span>
        </div>
    );

    return (
        <div className="flex flex-col justify-center items-center pb-[30vh] gap-20 mobile:gap-20 mobile:pb-[70vh]">
            {title}
            {form}
            <div
                className={`w-full p-10 rounded-3xl transition-all duration-200 mobile:p-0 mobile:bg-transparent
                    ${isDarkMode ? "bg-black" : "bg-white"}
                `}
            >
                {recipes.length > 0 ? recipesComponent : noData}
            </div>
        </div>
    );
};

export default Recipes;
