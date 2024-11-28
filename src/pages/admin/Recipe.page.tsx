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
import { CATEGORIES_API, IMAGES_API, RECIPES_API } from "../../api";

// Assets
import { ImageIcon, SaveIcon } from "../../assets/icons";

// Components
import {
    Card,
    GoBackBtn,
    IconButton,
    Input,
    InputFile,
    Procedure,
    Ingredients,
    Autocomplete,
} from "../../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../../providers";

// Types
import {
    CategoryT,
    ErrorT,
    LoaderContextI,
    OptionT,
    RecipeT,
    SnackbarContextI,
    ThemeContextI,
} from "../../types";

// Utilities
import {
    checkFormField,
    checkFormFieldImage,
    setPageTitle,
} from "../../utilities";

interface FormDataI {
    id: string;
    name: string;
    time: string;
    peopleNumber: string;
    category: OptionT;
    image: File | null;
}

const formDataInitialState: FormDataI = {
    id: "",
    name: "",
    time: "",
    peopleNumber: "",
    category: { key: "", value: "" },
    image: null,
};

interface ErrorsI {
    name: ErrorT;
    time: ErrorT;
    peopleNumber: ErrorT;
    category: ErrorT;
    image: ErrorT;
}

const errorsInitialValues: ErrorsI = {
    name: {
        value: false,
        message: null,
    },
    time: {
        value: false,
        message: null,
    },
    peopleNumber: {
        value: false,
        message: null,
    },
    category: {
        value: false,
        message: null,
    },
    image: {
        value: false,
        message: null,
    },
};

const Recipe: FC = () => {
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
    const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
    const [categories, setCategories] = useState<OptionT[]>([]);

    const isEditMode: boolean = id ? true : false;
    const pageTitle: string = `${id ? "Modifica" : "Nuova"} Ricetta`;
    const isDarkMode: boolean = theme === "dark";

    setPageTitle(pageTitle);

    async function getDataHandler() {
        setIsLoading(true);

        const categoriesRes = await CATEGORIES_API.getAllWithoutFilters();

        if (categoriesRes && categoriesRes.data) {
            const categories: OptionT[] = [];
            categoriesRes.data.map((category: CategoryT) =>
                categories.push({ key: category.id, value: category.name })
            );
            setCategories(categories);
        } else activateSnackbar("Impossibile recuperare le categorie", "error");

        if (isEditMode && id) {
            const recipeRes = await RECIPES_API.get(id);
            const recipeCategory = categoriesRes.data.find(
                (category: CategoryT) => category.name === recipeRes.category
            );

            if (recipeRes)
                setFormData({
                    ...recipeRes,
                    image: recipeRes.id,
                    peopleNumber: recipeRes.peopleNumber.toString(),
                    category: {
                        key: recipeCategory.id,
                        value: recipeCategory.name,
                    },
                });
            else activateSnackbar("Impossibile recuperare la ricetta", "error");
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getDataHandler();

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (formData.image && typeof formData.image === "object") {
            let src = URL.createObjectURL(formData.image);
            let imagePreview: any = document.getElementById("image");
            if (imagePreview) imagePreview.src = src;
        }
    }, [formData.image]);

    const title = <span className="text-3xl text-primary">{pageTitle}</span>;

    const goBackBtn = <GoBackBtn isDarkMode={isDarkMode} />;

    function inputHandler(
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function imageHandler(file: File): void {
        setFormData((prevState) => ({
            ...prevState,
            image: file,
        }));
        setIsImageUpdated(true);
    }

    function autocompleteHandler(option: any): void {
        setFormData((prevState) => ({
            ...prevState,
            category: option,
        }));
    }

    const form = (
        <Card>
            <form className="flex flex-col gap-10 mobile:gap-5">
                <div className="flex justify-center items-center gap-10">
                    {formData.image && (
                        <img
                            id="image"
                            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${formData?.id}`}
                            alt="Impossibile visualizzare l'immagine."
                            className="w-40 rounded-lg object-contain"
                        />
                    )}
                    <InputFile
                        value={formData.image}
                        onChange={imageHandler}
                        icon={<ImageIcon className="text-3xl text-primary" />}
                        error={errors.image}
                    />
                </div>
                <div className="flex flex-row gap-20 mobile:flex-col mobile:gap-5">
                    <Input
                        name="name"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={inputHandler}
                        error={errors.name}
                        isDarkMode={isDarkMode}
                    />
                    <Autocomplete
                        value={formData.category}
                        onChange={autocompleteHandler}
                        options={categories}
                        placeholder="Categoria"
                        error={errors.category}
                        isDarkMode={isDarkMode}
                    />
                    <Input
                        name="time"
                        placeholder="Tempo"
                        value={formData.time}
                        onChange={inputHandler}
                        error={errors.time}
                        isDarkMode={isDarkMode}
                    />
                    <Input
                        type="number"
                        name="peopleNumber"
                        placeholder="Numero di persone"
                        value={formData.peopleNumber}
                        onChange={inputHandler}
                        error={errors.peopleNumber}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </form>
        </Card>
    );

    const ingredients = isEditMode && (
        <Ingredients isDarkMode={isDarkMode} isAdminSection recipeId={id} />
    );

    const procedure = isEditMode && (
        <Procedure isDarkMode={isDarkMode} isAdminSection recipeId={id} />
    );

    function validateForm(): boolean {
        const hasNameError: ErrorT = checkFormField(formData.name);
        const hasTimeError: ErrorT = checkFormField(formData.time);
        const hasPeopleNumberError: ErrorT = checkFormField(
            formData.peopleNumber
        );
        const hasCategoryError: ErrorT = checkFormField(
            formData.category.value
        );
        const hasImageError = checkFormFieldImage(formData.image);

        setErrors((prevState) => ({
            ...prevState,
            name: {
                value: hasNameError.value,
                message: hasNameError.message,
            },
            time: {
                value: hasTimeError.value,
                message: hasTimeError.message,
            },
            peopleNumber: {
                value: hasPeopleNumberError.value,
                message: hasPeopleNumberError.message,
            },
            category: {
                value: hasCategoryError.value,
                message: hasCategoryError.message,
            },
            image: {
                value: hasImageError.value,
                message: hasImageError.message,
            },
        }));

        if (
            !hasNameError.value &&
            !hasTimeError.value &&
            !hasPeopleNumberError.value &&
            !hasCategoryError.value &&
            !hasImageError.value
        )
            return true;
        else return false;
    }

    async function submitHandler(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsLoading(true);

        const isFormValid: boolean = validateForm();

        if (isFormValid) {
            if (isEditMode && id) {
                const data: RecipeT = {
                    id: formData.id,
                    name: formData.name,
                    time: formData.time,
                    peopleNumber: parseInt(formData.peopleNumber),
                    category: formData.category?.value,
                };

                const res = await RECIPES_API.update(data, id);

                if (res && typeof res === "string") {
                    if (isImageUpdated && formData.image) {
                        const deleteImageRes: boolean = await IMAGES_API.delete(
                            id
                        );

                        if (deleteImageRes) {
                            const imageRes = await IMAGES_API.add(
                                res,
                                formData.image
                            );

                            if (imageRes) {
                                activateSnackbar(
                                    "Ricetta aggiornata con successo",
                                    "success"
                                );
                                await getDataHandler();
                            } else {
                                activateSnackbar(
                                    "Impossibile aggiungere l'immagine alla ricetta",
                                    "error"
                                );
                            }
                        } else {
                            activateSnackbar(
                                "Impossibile cancellare l'immagine precedente",
                                "error"
                            );
                        }
                    } else {
                        activateSnackbar(
                            "Ricetta aggiornata con successo",
                            "success"
                        );
                        await getDataHandler();
                    }
                } else {
                    activateSnackbar(
                        "Impossibile aggiornare la ricetta",
                        "error"
                    );
                }
            } else {
                const data: RecipeT = {
                    name: formData.name,
                    time: formData.time,
                    peopleNumber: parseInt(formData.peopleNumber),
                    category: formData.category.value,
                };

                const res = await RECIPES_API.create(data);
                if (res && typeof res !== "boolean" && formData.image) {
                    const imageRes = await IMAGES_API.add(res, formData.image);
                    if (imageRes) {
                        activateSnackbar(
                            "Ricetta creata con successo",
                            "success"
                        );
                        navigate(`/admin/recipes/${res}`);
                    } else {
                        activateSnackbar(
                            "Impossibile aggiungere l'immagine alla ricetta",
                            "error"
                        );
                    }
                } else {
                    activateSnackbar("Impossibile creare la ricetta", "error");
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
            {ingredients}
            {procedure}
            {btn}
        </div>
    );
};

export default Recipe;
