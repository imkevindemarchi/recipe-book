import React, { ChangeEvent, FC, FormEvent, ReactNode, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router";

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

// Utils
import { setPageTitle } from "../utils";

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

  setPageTitle("Log In");

  function onInputChange(propLabel: keyof IFormData, value: any) {
    setFormData((prevState: IFormData) => {
      return { ...prevState, [propLabel]: value };
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function onPasswordTypeChange() {
    setPasswordType(passwordType === "password" ? "text" : "password");
  }

  function onGoToRegisterPage() {
    navigate("/register");
  }

  const title: ReactNode = (
    <div className="flex flex-row items-center">
      <img src={logoImg} className="w-32" alt="" />
      <span className="font-bold text-white text-[3em]">Benvenuto</span>
    </div>
  );

  const description: ReactNode = (
    <div className="flex justify-center items-center">
      <span className="text-white opacity-70 text-base">
        Accedi al tuo ricettario
      </span>
    </div>
  );

  const form: ReactNode = (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Input
          name="email"
          autoFocus
          placeholder="E-mail"
          startIcon={<EmailIcon className="text-white text-2xl" />}
          value={formData.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onInputChange("email", event.target.value)
          }
          className="w-[35vh]"
          autoComplete="email"
        />
        <Input
          type={passwordType}
          name="password"
          placeholder="Password"
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
          className="w-[35vh]"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" text="Accedi" />
    </form>
  );

  return (
    <div
      style={{ backgroundImage: `url("${wallpaperImg}")` }}
      className="w-full h-[100vh] bg-cover flex items-center justify-center flex-col gap-5"
    >
      {title}
      {description}
      <LiquidGlass className="px-10 py-5 flex flex-col gap-5">
        {form}
        <span className="text-white opacity-80 text-sm text-center">
          Non hai un account?{" "}
          <span
            onClick={onGoToRegisterPage}
            className="text-primary cursor-pointer hover:opacity-50 transition-all duration-300"
          >
            Registrati
          </span>
        </span>
      </LiquidGlass>
    </div>
  );
};

export default Login;
