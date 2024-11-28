import {
    ChangeEvent,
    FC,
    MouseEvent,
    useContext,
    useEffect,
    useState,
} from "react";

// Api
import { INGREDIENTS_API, INGREDIENTS_X_RECIPES_API } from "../api";

// Assets
import { AddIcon, DeleteIcon } from "../assets/icons";

// Components
import Card from "./Card.component";
import Input from "./Input.component";
import Autocomplete from "./Autocomplete.component";
import Modal from "./Modal.component";
import IconButton from "./IconButton.component";
import IngredientsCarousel from "./IngredientsCarousel.component";

// Contexts
import { LoaderContext, SnackbarContext } from "../providers";

// Types
import {
    ErrorT,
    IngredientT,
    LoaderContextI,
    OptionT,
    ProcedureI,
    SnackbarContextI,
} from "../types";

// Utilities
import { checkFormField } from "../utilities";

interface FormDataI {
    name: string;
    quantity: string;
    ingredient: OptionT;
}

const formDataInitialState: FormDataI = {
    name: "",
    quantity: "",
    ingredient: { key: "", value: "" },
};

interface ErrorsI {
    name: ErrorT;
    quantity: ErrorT;
    ingredient: ErrorT;
}

const errorsInitialValues: ErrorsI = {
    name: {
        value: false,
        message: null,
    },
    quantity: {
        value: false,
        message: null,
    },
    ingredient: {
        value: false,
        message: null,
    },
};

const Ingredients: FC<ProcedureI> = ({
    isDarkMode,
    isAdminSection,
    recipeId,
}) => {
    const [ingredients, setIngredients] = useState<OptionT[]>([]);
    const [recipeIngredients, setRecipeIngredients] = useState<IngredientT[]>(
        []
    );
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [errors, setErrors] = useState<ErrorsI>(errorsInitialValues);
    const [formData, setFormData] = useState<FormDataI>(formDataInitialState);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] =
        useState<IngredientT | null>(null);

    async function getDataHandler() {
        setIsLoading(true);

        if (recipeId) {
            const ingredientsRes = await INGREDIENTS_API.getAllWithoutFilters();
            const recipeIngredientsRes =
                await INGREDIENTS_X_RECIPES_API.getByRecipeId(recipeId);

            if (ingredientsRes && ingredientsRes.data) {
                const ingredients: OptionT[] = [];

                ingredientsRes.data.map(
                    (ingredient: IngredientT) =>
                        !ingredient.recipeId &&
                        ingredients.push({
                            key: ingredient.id,
                            value: ingredient.name,
                            icon: ingredient.icon,
                        })
                );
                setIngredients(ingredients);
            } else
                activateSnackbar(
                    "Impossibile recuperare gli ingredienti",
                    "error"
                );

            if (recipeIngredientsRes)
                setRecipeIngredients(recipeIngredientsRes);
            else
                activateSnackbar(
                    "Impossibile recuperare gli ingredienti",
                    "error"
                );
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, []);

    const title = (
        <span
            className={`transition-all duration-200 text-3xl mobile:text-2xl
                ${isAdminSection && "text-primary"}
                ${
                    !isAdminSection &&
                    (isDarkMode ? "text-white" : "text-black")
                } 
            `}
        >
            Ingredienti
        </span>
    );

    function inputHandler(
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function validateForm(): boolean {
        const hasIngredientError: ErrorT = checkFormField(
            formData.ingredient?.value || ""
        );
        const hasQuantityError: ErrorT = checkFormField(formData.quantity);

        setErrors((prevState) => ({
            ...prevState,
            ingredient: {
                value: hasIngredientError.value,
                message: hasIngredientError.message,
            },
            quantity: {
                value: hasQuantityError.value,
                message: hasQuantityError.message,
            },
        }));

        if (!hasIngredientError.value && !hasQuantityError.value) return true;
        else return false;
    }

    async function submitHandler(event: any) {
        event.preventDefault();
        setIsLoading(true);

        const isFormValid: boolean = validateForm();

        if (isFormValid && recipeId) {
            const data: IngredientT = {
                name: formData.ingredient.value,
                recipeId,
                icon: formData.ingredient.icon,
                quantity: formData.quantity,
            };

            const res = await INGREDIENTS_X_RECIPES_API.create(data);

            if (res) {
                activateSnackbar(
                    "Ingrediente inserito con successo",
                    "success"
                );
                setFormData(formDataInitialState);
                await getDataHandler();
            }
        }

        setIsLoading(false);
    }

    function autocompleteHandler(option: any): void {
        setFormData((prevState) => ({
            ...prevState,
            ingredient: option,
        }));
    }

    const form = isAdminSection && (
        <Card>
            <form
                onSubmit={submitHandler}
                className="flex flex-row items-center gap-5 mobile:flex-col"
            >
                <div className="w-[50vh] mobile:w-full">
                    <Autocomplete
                        value={formData.ingredient}
                        onChange={autocompleteHandler}
                        options={ingredients}
                        placeholder="Ingrediente"
                        error={errors.ingredient}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <div className="w-[30vh] mobile:w-full">
                    <Input
                        name="quantity"
                        placeholder="Quantità"
                        value={formData.quantity}
                        onChange={inputHandler}
                        error={errors.quantity}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <button
                    type="submit"
                    className="transition-all duration-200 hover:opacity-50"
                >
                    <AddIcon className="text-primary text-[3em] mobile:text-[4em]" />
                </button>
            </form>
        </Card>
    );

    function onDeleteHandler(
        event: MouseEvent<HTMLButtonElement>,
        ingredient: IngredientT
    ): void {
        event.preventDefault();
        setSelectedIngredient(ingredient);
        setIsDeleteModalOpen(true);
    }

    const adminIngredientsComponent = recipeIngredients.length > 0 && (
        <div className="flex flex-col gap-10">
            {recipeIngredients.map((recipeIngredient: IngredientT) => {
                return (
                    <div
                        key={recipeIngredient.id}
                        className="w-full rounded-lg px-5 py-3 justify-between flex flex-row items-center bg-primary-transparent"
                    >
                        <span
                            className={`transition-all duration-200
                                ${isDarkMode ? "text-white" : "text-black"}
                            `}
                        >
                            <span className="text-primary font-bold">
                                {`${recipeIngredient.icon} ${recipeIngredient.name} `}
                            </span>
                            - {recipeIngredient.quantity}
                        </span>
                        {isAdminSection && (
                            <IconButton
                                onClick={(
                                    event: MouseEvent<HTMLButtonElement>
                                ) => onDeleteHandler(event, recipeIngredient)}
                                className="bg-primary-transparent"
                            >
                                <DeleteIcon className="text-2xl text-primary" />
                            </IconButton>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const ingredientsComponent = isAdminSection ? (
        adminIngredientsComponent
    ) : (
        <IngredientsCarousel data={recipeIngredients} isDarkMode={isDarkMode} />
    );

    async function deleteHandler() {
        setIsLoading(true);

        if (selectedIngredient?.id) {
            const res = await INGREDIENTS_X_RECIPES_API.delete(
                selectedIngredient?.id
            );

            if (res) {
                setIsDeleteModalOpen(false);
                activateSnackbar(
                    "Ingrediente eliminato con successo",
                    "success"
                );
                await getDataHandler();
            } else
                activateSnackbar(
                    "Impossibile eliminare l'ingrediente",
                    "error"
                );
        }

        setIsLoading(false);
    }

    const modal = (
        <Modal
            title="Elimina ingrediente"
            cancelBtnText="No"
            isDarkMode={isDarkMode}
            submitBtnText="Sì"
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            submitHandler={deleteHandler}
        >
            <span
                className={`transition-all duration-200 text-lg
                    ${isDarkMode ? "text-white" : "text-black"}
                `}
            >
                Confermi di voler eliminare l'ingrediente
                <span className="text-primary ml-1 mr-1">
                    {`${selectedIngredient?.name}`}
                </span>
                ?
            </span>
        </Modal>
    );

    return (
        <>
            <div className="flex flex-col gap-10 w-full">
                {title}
                {form}
                {ingredientsComponent}
            </div>
            {modal}
        </>
    );
};

export default Ingredients;
