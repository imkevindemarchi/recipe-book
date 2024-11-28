import {
    ChangeEvent,
    FC,
    MouseEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

// Api
import { INGREDIENTS_API } from "../../api";

// Assets
import { SaveIcon } from "../../assets/icons";

// Components
import { Card, GoBackBtn, IconButton, Input } from "../../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../../providers";

// Types
import {
    ErrorT,
    LoaderContextI,
    IngredientT,
    SnackbarContextI,
    ThemeContextI,
} from "../../types";

// Utilities
import { checkFormField, setPageTitle } from "../../utilities";

interface FormDataI {
    id: string;
    name: string;
    icon: string;
}

const formDataInitialState: FormDataI = {
    id: "",
    name: "",
    icon: "",
};

interface ErrorsI {
    name: ErrorT;
    icon: ErrorT;
}

const errorsInitialValues: ErrorsI = {
    name: {
        value: false,
        message: null,
    },
    icon: {
        value: false,
        message: null,
    },
};

const Ingredient: FC = () => {
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;
    const [formData, setFormData] = useState<FormDataI>(formDataInitialState);
    const [errors, setErrors] = useState<ErrorsI>(errorsInitialValues);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const navigate: NavigateFunction = useNavigate();
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const { id } = useParams();

    const isEditMode: boolean = id ? true : false;
    const pageTitle: string = `${id ? "Modifica" : "Nuovo"} Ingrediente`;
    const isDarkMode: boolean = theme === "dark";

    setPageTitle(pageTitle);

    async function getDataHandler() {
        setIsLoading(true);

        if (id) {
            const res = await INGREDIENTS_API.get(id);

            if (res) setFormData(res);
            else
                activateSnackbar(
                    "Impossibile recuperare l'ingrediente",
                    "error"
                );
        }

        setIsLoading(false);
    }

    useEffect(() => {
        isEditMode && getDataHandler();

        // eslint-disable-next-line
    }, []);

    const title = <span className="text-3xl text-primary">{pageTitle}</span>;

    const goBackBtn = <GoBackBtn isDarkMode={isDarkMode} />;

    function inputHandler(
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    const form = (
        <Card>
            <form className="flex flex-col gap-10 mobile:gap-5">
                <div className="flex flex-row gap-20 mobile:flex-col mobile:gap-5">
                    <Input
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={inputHandler}
                        error={errors.name}
                        isDarkMode={isDarkMode}
                    />
                    <div className="w-[30vh] mobile:w-full">
                        <Input
                            name="icon"
                            placeholder="Icona"
                            value={formData.icon}
                            onChange={inputHandler}
                            error={errors.icon}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>
            </form>
        </Card>
    );

    function validateForm(): boolean {
        const hasNameError: ErrorT = checkFormField(formData.name);
        const hasIconError: ErrorT = checkFormField(formData.icon);

        setErrors((prevState) => ({
            ...prevState,
            name: {
                value: hasNameError.value,
                message: hasNameError.message,
            },
            icon: {
                value: hasIconError.value,
                message: hasIconError.message,
            },
        }));

        if (!hasNameError.value && !hasIconError.value) return true;
        else return false;
    }

    async function submitHandler(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsLoading(true);

        const isFormValid: boolean = validateForm();

        if (isFormValid) {
            if (isEditMode && id) {
                const data: IngredientT = {
                    id: formData.id,
                    name: formData.name,
                    icon: formData.icon,
                };

                const res = await INGREDIENTS_API.update(data, id);

                if (res && typeof res === "string") {
                    activateSnackbar(
                        "Ingrediente aggiornato con successo",
                        "success"
                    );
                    await getDataHandler();
                } else {
                    activateSnackbar(
                        "Impossibile aggiornare l'ingrediente",
                        "error"
                    );
                }
            } else {
                const data: IngredientT = {
                    name: formData.name,
                    icon: formData.icon,
                };

                const res = await INGREDIENTS_API.create(data);
                if (res && typeof res !== "boolean") {
                    activateSnackbar(
                        "Ingrediente creato con successo",
                        "success"
                    );
                    navigate(`/admin/ingredients/${res}`);
                } else {
                    activateSnackbar(
                        "Impossibile creare l'ingrediente",
                        "error"
                    );
                }
            }
        }

        setIsLoading(false);
    }

    const btn = (
        <div className="fixed bottom-10 right-10 mobile:bottom-5 mobile:right-5">
            <IconButton onClick={submitHandler} className="px-4 py-4 bg-pink-2">
                <SaveIcon className="text-primary text-3xl" />
            </IconButton>
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            {title}
            {goBackBtn}
            {form}
            {btn}
        </div>
    );
};

export default Ingredient;
