import {
    ChangeEvent,
    FC,
    MouseEvent,
    useContext,
    useEffect,
    useState,
} from "react";

// Api
import { PROCEDURES_API } from "../api";

// Assets
import { AddIcon, DeleteIcon } from "../assets/icons";

// Components
import Card from "./Card.component";
import TextArea from "./TextArea.component";
import IconButton from "./IconButton.component";
import Modal from "./Modal.component";

// Contexts
import { LoaderContext, SnackbarContext } from "../providers";

// Types
import {
    ErrorT,
    LoaderContextI,
    ProcedureI,
    SnackbarContextI,
    StepT,
} from "../types";

// Utilities
import { checkFormField } from "../utilities";
import Steps from "./Steps.component";

interface FormDataI {
    step: string;
}

const formDataInitialState: FormDataI = {
    step: "",
};

interface ErrorsI {
    value: ErrorT;
}

const errorsInitialValues: ErrorsI = {
    value: {
        value: false,
        message: null,
    },
};

const Procedure: FC<ProcedureI> = ({
    isDarkMode,
    isAdminSection,
    recipeId,
}) => {
    const [steps, setSteps] = useState<StepT[]>([]);
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const [errors, setErrors] = useState<ErrorsI>(errorsInitialValues);
    const [formData, setFormData] = useState<FormDataI>(formDataInitialState);
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const [selectedStep, setSelectedStep] = useState<StepT | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    async function getDataHandler() {
        setIsLoading(true);

        if (recipeId) {
            const res = await PROCEDURES_API.getAll(recipeId);

            if (res) setSteps(res);
            else
                activateSnackbar(
                    "Impossibile recuperare gli step del procedimento",
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
            Procedimento
        </span>
    );

    function inputHandler(
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function validateForm(): boolean {
        const hasStepError: ErrorT = checkFormField(formData.step);

        setErrors((prevState) => ({
            ...prevState,
            step: {
                value: hasStepError.value,
                message: hasStepError.message,
            },
        }));

        if (!hasStepError.value) return true;
        else return false;
    }

    async function submitHandler(event: any) {
        event.preventDefault();
        setIsLoading(true);

        const isFormValid: boolean = validateForm();

        if (isFormValid && recipeId) {
            const data: StepT = {
                step: formData.step,
                recipeId,
            };

            const res = await PROCEDURES_API.create(data);

            if (res) {
                activateSnackbar("Step aggiunto con successo", "success");
                setFormData(formDataInitialState);
                await getDataHandler();
            }
        }

        setIsLoading(false);
    }

    const form = isAdminSection && (
        <Card>
            <form
                onSubmit={submitHandler}
                className="flex flex-row justify-between items-center gap-5 mobile:flex-col"
            >
                <TextArea
                    name="step"
                    placeholder="Step"
                    value={formData.step}
                    onChange={inputHandler}
                    error={errors.value}
                    isDarkMode={isDarkMode}
                />
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
        step: StepT
    ): void {
        event.preventDefault();
        setSelectedStep(step);
        setIsDeleteModalOpen(true);
    }

    const adminStepsComponent = steps.length > 0 && (
        <div className="flex flex-col gap-10">
            {steps.map((step: StepT) => {
                return (
                    <div
                        key={step.id}
                        className={`w-full rounded-lg px-5 py-3 justify-between flex flex-row items-center
                            ${isAdminSection && "bg-primary-transparent"}
                            ${
                                !isAdminSection &&
                                (isDarkMode ? "bg-black" : "bg-white")
                            }
                        `}
                    >
                        <span
                            className={`transition-all duration-200
                                ${isDarkMode ? "text-white" : "text-black"}
                            `}
                        >
                            <span className="text-primary font-bold">
                                {step.step}
                            </span>
                        </span>
                        {isAdminSection && (
                            <IconButton
                                onClick={(
                                    event: MouseEvent<HTMLButtonElement>
                                ) => onDeleteHandler(event, step)}
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

    const stepsComponent = isAdminSection ? (
        adminStepsComponent
    ) : (
        <Steps data={steps} isDarkMode={isDarkMode} />
    );

    async function deleteHandler() {
        setIsLoading(true);

        if (selectedStep?.id) {
            const res = await PROCEDURES_API.delete(selectedStep.id);

            if (res) {
                setIsDeleteModalOpen(false);
                activateSnackbar("Step eliminato con successo", "success");
                await getDataHandler();
            } else activateSnackbar("Impossibile eliminare lo step", "error");
        }

        setIsLoading(false);
    }

    const modal = (
        <Modal
            title="Elimina Step"
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
                Confermi di voler eliminare lo step?
            </span>
        </Modal>
    );

    return (
        <>
            <div className="flex flex-col gap-10 w-full">
                {title}
                {form}
                {stepsComponent}
            </div>
            {modal}
        </>
    );
};

export default Procedure;
