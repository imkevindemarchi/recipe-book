import { ChangeEvent, FC, MouseEvent, useContext, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// Api
import { AUTH_API } from "../api";

// Assets
import { ClosedEyeIcon, OpenedEyeIcon } from "../assets/icons";

// Components
import { Button, Input } from "../components";

// Contexts
import { AuthContext, LoaderContext, SnackbarContext } from "../providers";

// Types
import {
    AuthContextI,
    ErrorT,
    LoaderContextI,
    SnackbarContextI,
} from "../types";

// Utilities
import { checkEmail, setPageTitle, setToStorage } from "../utilities";

interface FormDataI {
    email: string;
    password: string;
}

type PasswordT = "text" | "password";

interface ErrorsI {
    email: ErrorT;
    password: ErrorT;
}

const formDataInitialValues: FormDataI = {
    email: "",
    password: "",
};

const errorsInitialValues: ErrorsI = {
    email: {
        value: false,
        message: null,
    },
    password: {
        value: false,
        message: null,
    },
};

const LogIn: FC = () => {
    const [formData, setFormData] = useState<FormDataI>(formDataInitialValues);
    const [passwordType, setPasswordType] = useState<PasswordT>("password");
    const [errors, setErrors] = useState<ErrorsI>(errorsInitialValues);
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { setSession } = useContext(AuthContext) as AuthContextI;
    const navigate: NavigateFunction = useNavigate();

    setPageTitle("Log In");

    function resetError(name: string): void {
        setErrors((prevState) => ({
            ...prevState,
            [name]: { value: false, message: null },
        }));
    }

    function inputHandler(event: ChangeEvent<HTMLInputElement>): void {
        const { name, value }: { name: string; value: string } = event.target;

        setFormData((prevState) => ({ ...prevState, [name]: value }));

        resetError(name);
    }

    function passwordTypeHandler(event: MouseEvent<HTMLInputElement>): void {
        event.preventDefault();
        event.stopPropagation();

        setPasswordType(passwordType === "password" ? "text" : "password");
    }

    const passwordEndIcon = (
        <div onClick={passwordTypeHandler}>
            {passwordType === "password" ? (
                <OpenedEyeIcon className="transition-all duration-200 text-2xl cursor-pointer hover:opacity-80" />
            ) : (
                <ClosedEyeIcon className="transition-all duration-200 text-2xl cursor-pointer hover:opacity-80" />
            )}
        </div>
    );

    async function submitHandler(event: any) {
        setIsLoading(true);
        event.preventDefault();

        const isEmailValid: ErrorT = checkEmail(formData.email);

        if (isEmailValid.value)
            setErrors((prevState) => ({
                ...prevState,
                email: isEmailValid,
            }));
        else {
            const res = await AUTH_API.login(formData.email, formData.password);

            if (!res || !res.value)
                activateSnackbar("Impossibile effettuare il log in", "error");
            else {
                setToStorage("session", res.data);
                setSession(res.data);
                navigate("/admin");
            }
        }

        setIsLoading(false);
    }

    const form = (
        <form
            onSubmit={submitHandler}
            style={{
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "16px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(7.5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            className="py-20 px-40 flex flex-col gap-5 justify-center items-center mobile:px-8"
        >
            <span className="text-white font-bold uppercase text-3xl">
                Log In
            </span>
            <Input
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={inputHandler}
                error={errors.email}
            />
            <Input
                type={passwordType}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={inputHandler}
                endIcon={passwordEndIcon}
                error={errors.password}
            />
            <Button type="submit">
                <span className="text-lg text-white">Accedi</span>
            </Button>
        </form>
    );

    return (
        <div className="flex justify-center items-center h-[100vh] w-full bg-primary">
            {form}
        </div>
    );
};

export default LogIn;
