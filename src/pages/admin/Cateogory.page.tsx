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
import { IMAGES_API, CATEGORIES_API } from "../../api";

// Assets
import { ImageIcon, SaveIcon } from "../../assets/icons";

// Components
import {
    Card,
    GoBackBtn,
    IconButton,
    Input,
    InputFile,
} from "../../components";

// Contexts
import { LoaderContext, SnackbarContext, ThemeContext } from "../../providers";

// Types
import {
    ErrorT,
    LoaderContextI,
    CategoryT,
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
    image: File | null;
}

const formDataInitialState: FormDataI = {
    id: "",
    name: "",
    image: null,
};

interface ErrorsI {
    name: ErrorT;
    image: ErrorT;
}

const errorsInitialValues: ErrorsI = {
    name: {
        value: false,
        message: null,
    },
    image: {
        value: false,
        message: null,
    },
};

const Category: FC = () => {
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

    const isEditMode: boolean = id ? true : false;
    const pageTitle: string = `${id ? "Modifica" : "Nuova"} Categoria`;
    const isDarkMode: boolean = theme === "dark";

    setPageTitle(pageTitle);

    async function getDataHandler() {
        if (id) {
            setIsLoading(true);

            const res = await CATEGORIES_API.get(id);
            setFormData({
                ...res,
                image: res.id,
            });

            setIsLoading(false);
        }
    }

    useEffect(() => {
        isEditMode && getDataHandler();

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
                </div>
            </form>
        </Card>
    );

    function validateForm(): boolean {
        const hasNameError: ErrorT = checkFormField(formData.name);
        const hasImageError = checkFormFieldImage(formData.image);

        setErrors((prevState) => ({
            ...prevState,
            name: {
                value: hasNameError.value,
                message: hasNameError.message,
            },
            image: {
                value: hasImageError.value,
                message: hasImageError.message,
            },
        }));

        if (!hasNameError.value && !hasImageError.value) return true;
        else return false;
    }

    async function submitHandler(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsLoading(true);

        const isFormValid: boolean = validateForm();

        if (isFormValid) {
            if (isEditMode && id) {
                const data: CategoryT = {
                    id: formData.id,
                    name: formData.name,
                };

                const res = await CATEGORIES_API.update(data, id);

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
                                    "Categoria aggiornata con successo",
                                    "success"
                                );
                                await getDataHandler();
                            } else {
                                activateSnackbar(
                                    "Impossibile aggiungere l'immagine alla categoria",
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
                            "Categoria aggiornata con successo",
                            "success"
                        );
                        await getDataHandler();
                    }
                } else {
                    activateSnackbar(
                        "Impossibile aggiornare la categoria",
                        "error"
                    );
                }
            } else {
                const data: CategoryT = {
                    name: formData.name,
                };

                const res = await CATEGORIES_API.create(data);
                if (res && typeof res !== "boolean" && formData.image) {
                    const imageRes = await IMAGES_API.add(res, formData.image);
                    if (imageRes) {
                        activateSnackbar(
                            "Categoria creata con successo",
                            "success"
                        );
                        navigate(`/admin/categories/${res}`);
                    } else {
                        activateSnackbar(
                            "Impossibile aggiungere l'immagine alla categoria",
                            "error"
                        );
                    }
                } else {
                    activateSnackbar(
                        "Impossibile creare la categoria",
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

export default Category;
