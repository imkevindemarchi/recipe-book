import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

// Api
import { AUTH_API } from "../api";

// Assets
import wallpaperImg from "../assets/images/login-wallpaper.jpg";
import logoImg from "../assets/images/logo.png";
import {
  EmailIcon,
  LockIcon,
  OpenedEyeIcon,
  ClosedEyeIcon,
} from "../assets/icons";

// Components
import { Button, Input, LiquidGlass } from "../components";

// Contexts
import { PopupContext, TPopupContext } from "../providers/popup.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";

// Types
import { THTTPResponse, TLoginPayload } from "../types";

// Utils
import { setPageTitle, validateEmail } from "../utils";

interface IFormData {
  email: string;
  password: string;
}

type TPasswordType = "password" | "text";

const DEFAULT_FORM_DATA: IFormData = {
  email: "",
  password: "",
};

const Login: FC = () => {
  const [formData, setFormData] = useState<IFormData>(DEFAULT_FORM_DATA);
  const [passwordType, setPasswordType] = useState<TPasswordType>("password");
  const navigate: NavigateFunction = useNavigate();
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { t } = useTranslation();

  setPageTitle("Log In");

  function onInputChange(propLabel: keyof IFormData, value: any) {
    setFormData((prevState: IFormData) => {
      return { ...prevState, [propLabel]: value };
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email: string = formData.email;
    const password: string = formData.password;

    if (email.trim() === "" && password.trim() === "")
      openPopup(t("enterEmailAndPassword"), "warning");
    else if (email.trim() === "") openPopup(t("enterEmail"), "warning");
    else if (password.trim() === "") openPopup(t("enterPassword"), "warning");
    else {
      setIsLoading(true);
      try {
        const isEmailValid: boolean = validateEmail(email);

        if (isEmailValid) {
          const payload: TLoginPayload = {
            email,
            password,
          };

          await Promise.resolve(
            AUTH_API.login(payload).then((response: THTTPResponse) => {
              if (response.hasSuccess) {
                navigate("/admin");
              }
            })
          );
        } else openPopup(t("invalidEnteredEmail"), "warning");
      } catch (error) {
        console.error("🚀 ~ onSubmit - error:", error);
      }
      setIsLoading(false);
    }
  }

  function onPasswordTypeChange() {
    setPasswordType(passwordType === "password" ? "text" : "password");
  }

  const title: ReactNode = (
    <div className="flex flex-row items-center">
      <img src={logoImg} className="w-32 mobile:w-28" alt={t("imgNotFound")} />
      <span className="font-bold text-white text-[3em] mobile:text-3xl">
        {t("welcome")}
      </span>
    </div>
  );

  const description: ReactNode = (
    <div className="flex justify-center items-center">
      <span className="text-white opacity-70 text-base">
        {t("logInYourRecipeBook")}
      </span>
    </div>
  );

  const form: ReactNode = (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Input
          name="email"
          autoFocus
          placeholder={t("email")}
          startIcon={<EmailIcon className="text-white text-2xl" />}
          value={formData.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onInputChange("email", event.target.value)
          }
          className="w-[35vh] mobile:w-full"
          autoComplete="email"
        />
        <Input
          type={passwordType}
          name="password"
          placeholder={t("password")}
          startIcon={<LockIcon className="text-white text-2xl" />}
          endIcon={
            <LiquidGlass
              className="p-1 cursor-pointer hover:opacity-50"
              onClick={onPasswordTypeChange}
            >
              {passwordType === "password" ? (
                <OpenedEyeIcon className="text-white text-base" />
              ) : (
                <ClosedEyeIcon className="text-white text-base" />
              )}
            </LiquidGlass>
          }
          value={formData.password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onInputChange("password", event.target.value)
          }
          className="w-[35vh] mobile:w-full"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" text={t("logIn")} />
    </form>
  );

  return (
    <div
      style={{ backgroundImage: `url("${wallpaperImg}")` }}
      className="w-full h-[100vh] mobile:h-[110vh] mobile:justify-start mobile:pt-36 bg-cover flex items-center justify-center flex-col gap-5"
    >
      {title}
      {description}
      <LiquidGlass className="px-10 py-5 flex flex-col gap-5 mobile:px-5 mobile:w-[90%]">
        {form}
      </LiquidGlass>
    </div>
  );
};

export default Login;
