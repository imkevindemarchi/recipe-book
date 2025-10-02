import React, { FC, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

// Assets
import { ArrowLeftIcon, ArrowRightIcon, SadIcon } from "../assets/icons";

// Components
import LiquidGlass from "./LiquidGlass.component";
import ProgressBar from "./ProgressBar.component";

interface IProps {
  steps: string[];
}

const Stepper: FC<IProps> = ({ steps }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(1);

  function calculateProgress(): number {
    return (currentStep / steps?.length) * 100;
  }

  function onStepHandler(step: number): void {
    setCurrentStep(step);
  }

  const progressBar: ReactNode = (
    <div className="flex items-center gap-5">
      <ProgressBar progress={calculateProgress()} />
      <span className="text-white">{`${currentStep}/${
        steps?.length || 0
      }`}</span>
    </div>
  );

  return (
    <LiquidGlass
      blur={20}
      className={`${
        steps && steps.length > 0
          ? "p-5 h-full flex flex-col justify-between mobile:py-10 mobile:gap-20"
          : "p-5 h-full flex justify-center items-center"
      }`}
    >
      {steps && steps.length > 0 ? (
        <>
          <div className="flex flex-col gap-5 h-full">
            {progressBar}
            <span className="font-bold text-white">
              {t("stepN", { step: currentStep })}
            </span>
            <div className="flex h-full w-full justify-center items-center">
              <span className="text-white text-center">
                {steps[currentStep - 1]}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <LiquidGlass
              onClick={() => currentStep > 1 && onStepHandler(currentStep - 1)}
              className={`flex items-center gap-2 underline underline-offset-4 transition-all duration-300 px-5 py-2 mobile:w-14 mobile:h-14 mobile:p-0 mobile:justify-center ${
                currentStep > 1
                  ? "text-white cursor-pointer hover:opacity-50 mobile:hover:opacity-100"
                  : "text-white cursor-default opacity-50"
              }`}
            >
              <ArrowLeftIcon className="mobile:text-3xl" />
              <span className="mobile:hidden">{t("previousStep")}</span>
            </LiquidGlass>
            {currentStep < steps.length && (
              <LiquidGlass
                onClick={() => onStepHandler(currentStep + 1)}
                className="flex items-center gap-2 underline underline-offset-4 transition-all duration-300 text-white cursor-pointer hover:opacity-50 mobile:hover:opacity-100 px-5 py-2 mobile:w-14 mobile:h-14 mobile:p-0 mobile:justify-center"
              >
                <span className="mobile:hidden">{t("nextStep")}</span>
                <ArrowRightIcon className="mobile:text-3xl" />
              </LiquidGlass>
            )}
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center items-center gap-5">
          <SadIcon className="text-[3em] text-white" />
          <span className="text-white text-sm">{t("noAvailableSteps")}</span>
        </div>
      )}
    </LiquidGlass>
  );
};

export default Stepper;
