import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";

// Components
import Button from "./Button.component";
import { ArrowLeftIcon } from "../assets/icons";

const GoBackButton: FC = () => {
  const { t } = useTranslation();
  const navigate: NavigateFunction = useNavigate();

  function onGoBack(): void {
    navigate(-1);
  }

  return (
    <Button
      variant="liquid-glass"
      onClick={onGoBack}
      text={t("goBack")}
      icon={<ArrowLeftIcon className="text-white text-xl" />}
    />
  );
};

export default GoBackButton;
