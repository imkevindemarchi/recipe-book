import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Assets
import wallpaperImg from "../assets/images/wallpaper.png";

// Components
import { Button, LiquidGlass } from "../components";

// Utils
import { setPageTitle } from "../utils";

const NotFound: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  setPageTitle("404");

  function onGoBackToHome(): void {
    navigate("/");
  }

  return (
    <div
      style={{ backgroundImage: `url("${wallpaperImg}")` }}
      className="w-full min-h-[100vh] bg-cover flex justify-center items-center"
    >
      <LiquidGlass className="p-10 flex flex-col gap-5" borderRadius={30}>
        <div className="flex flex-col text-center">
          <span className="text-white text-[5em] font-bold">404</span>
          <span className="text-xl text-white">{t("pageNotFound")}</span>
          <span className="text-xl text-white opacity-50">
            {t("linkMightBeCorrupted")}
          </span>
          <span className="text-white opacity-50">
            {t("pageCouldBeRemoved")}
          </span>
        </div>
        <Button
          variant="liquid-glass"
          onClick={onGoBackToHome}
          text={t("goBackToHome")}
        ></Button>
      </LiquidGlass>
    </div>
  );
};

export default NotFound;
