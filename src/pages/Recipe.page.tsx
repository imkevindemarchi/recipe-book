import { FC, MouseEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Api
import { RECIPES_API } from "../api";

// Assets
import {
    EmptyHearthIcon,
    HearthIcon,
    TimeIcon,
    UserIcon,
} from "../assets/icons";

// Components
import { GoBackBtn, IconButton, Ingredients, Procedure } from "../components";

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

const Recipe: FC = () => {
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const { id } = useParams();
    const [recipe, setRecipe] = useState<RecipeT | null>(null);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;

    setPageTitle("Ricetta");

    const isDarkMode: boolean = theme === "dark";

    async function getDataHandler() {
        setIsLoading(true);

        if (id) {
            const res = await RECIPES_API.get(id);

            if (res) setRecipe(res);
            else {
                activateSnackbar("Impossibile recuperare la ricetta", "error");
            }
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, []);

    const image = (
        <img
            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${recipe?.id}`}
            alt="Impossibile visualizzare l'immagine."
            className="w-full h-60 rounded-lg blur-sm"
        />
    );

    const title = (
        <span className="text-white absolute font-bold uppercase text-3xl mobile:text-2xl">
            {recipe?.name}
        </span>
    );

    const Row = ({
        icon,
        label,
    }: {
        icon: any;
        label?: string | undefined;
    }) => (
        <div className="flex flex-row items-center gap-1">
            {icon}
            <span
                className={`transition-all duration-200 text-lg
                    ${isDarkMode ? "text-white" : "text-black"}
                `}
            >
                {label}
            </span>
        </div>
    );

    async function favouriteHandler(event: MouseEvent<HTMLButtonElement>) {
        setIsLoading(true);
        event.preventDefault();

        if (id && recipe) {
            const data: RecipeT = {
                ...recipe,
                isFavourite: !recipe?.isFavourite,
            };
            const res = await RECIPES_API.update(data, id);

            if (res && typeof res === "string") await getDataHandler();
            else activateSnackbar("Impossibile aggiornare la ricetta", "error");
        }

        setIsLoading(false);
    }

    const info = (
        <div className="absolute w-full bottom-[-20px] left-0 flex justify-center items-center">
            <div
                className={`w-[90%] h-[100px] p-10 mobile:p-5 flex flex-row items-center justify-between transition-all duration-200 rounded-3xl
                    ${isDarkMode ? "bg-black" : "bg-white"}
                `}
            >
                <Row
                    icon={<TimeIcon className="text-2xl text-primary" />}
                    label={recipe?.time}
                />
                <Row
                    icon={
                        <IconButton onClick={favouriteHandler}>
                            {recipe?.isFavourite ? (
                                <HearthIcon className="text-3xl text-primary" />
                            ) : (
                                <EmptyHearthIcon className="text-3xl text-primary" />
                            )}
                        </IconButton>
                    }
                />
                <Row
                    icon={<UserIcon className="text-2xl text-primary" />}
                    label={`x ${recipe?.peopleNumber}`}
                />
            </div>
        </div>
    );

    const goBackBtn = <GoBackBtn isDarkMode={isDarkMode} />;

    const ingredients = (
        <div
            className={`w-[90%] mobile:w-full p-10 flex flex-row items-center justify-between transition-all duration-200 rounded-3xl
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            <Ingredients isDarkMode={isDarkMode} recipeId={id} />
        </div>
    );

    const procedure = (
        <div
            className={`w-[90%] mobile:w-full p-10 mobile:p-0 mobile:bg-transparent flex flex-row items-center justify-between transition-all duration-200 rounded-3xl
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            <Procedure isDarkMode={isDarkMode} recipeId={id} />
        </div>
    );

    return (
        <div className="flex flex-col justify-center items-center pb-[30vh] gap-14 mobile:gap-10 mobile:pb-[70vh]">
            <div className="relative w-full flex justify-center items-center">
                {image}
                {title}
                {info}
            </div>
            {goBackBtn}
            {ingredients}
            {procedure}
        </div>
    );
};

export default Recipe;
