import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";

// Api
import { INGREDIENT_API } from "../../api";

// Assets
import { CreateIcon, SaveIcon } from "../../assets/icons";

// Components
import { Button, Input, LiquidGlass } from "../../components";

// Contexts
import { PopupContext, TPopupContext } from "../../providers/popup.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";

// Types
import { THTTPResponse, TIngredient } from "../../types";

// Utils
import { setPageTitle } from "../../utils";
import { TValidation, validateFormField } from "../../utils/validation.util";

const DEFAULT_STATE: TIngredient = {
  id: null,
  label: "",
  icon: "",
};

type TErrors = {
  label: TValidation;
  icon: TValidation;
};

const ERRORS_DEFAULT_STATE: TErrors = {
  label: {
    isValid: true,
  },
  icon: {
    isValid: true,
  },
};

const AdminIngredient: FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TIngredient>(DEFAULT_STATE);
  const [errors, setErrors] = useState<TErrors>(ERRORS_DEFAULT_STATE);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { ingredientId } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [ingredients, setIngredients] = useState<TIngredient[] | null>(null);

  const isEditMode: boolean = ingredientId ? true : false;

  setPageTitle(isEditMode ? t("editIngredient") : t("newIngredient"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(INGREDIENT_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setIngredients(response.data);
        else openPopup(t("unableLoadIngredients"), "error");
      }
    );

    if (isEditMode)
      await Promise.resolve(INGREDIENT_API.get(ingredientId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadIngredient"), "error");
        }
      );

    setIsLoading(false);
  }

  function onInputChange(propLabel: keyof TIngredient, value: any): void {
    setFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function validateForm(): boolean {
    const isLabelValid: TValidation = validateFormField(
      formData.label as string
    );
    const isIconValid: TValidation = validateFormField(formData.icon as string);

    const isFormValid: boolean = isIconValid.isValid && isLabelValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        label: {
          isValid: isLabelValid.isValid,
          message: isLabelValid.message ? t(isLabelValid.message) : null,
        },
        icon: {
          isValid: isIconValid.isValid,
          message: isIconValid.message ? t(isIconValid.message) : null,
        },
      }));

      return false;
    }
  }

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const isFormValid: boolean = validateForm();
    const ingredientAlreadyExists: boolean = ingredients?.find(
      (ingredient: TIngredient) =>
        ingredient.label?.toLowerCase().trim() ===
        formData.label?.toLowerCase().trim()
    )
      ? true
      : false;

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else if (ingredientAlreadyExists && !isEditMode)
      openPopup(t("ingredientAlreadyExists"), "warning");
    else {
      setIsLoading(true);

      const data: Partial<TIngredient> = {
        label: formData.label,
        icon: formData.icon,
      };

      if (isEditMode)
        await Promise.resolve(
          INGREDIENT_API.update(data, ingredientId as string)
        ).then(async (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            openPopup(t("ingredientSuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateIngredient"), "error");
        });
      else
        await Promise.resolve(INGREDIENT_API.create(data)).then(
          async (response: THTTPResponse) => {
            if (response && response.hasSuccess) {
              openPopup(t("ingredientSuccessfullyCreated"), "success");
              navigate(`/admin/ingredients/edit/${response.data}`);
            } else openPopup(t("unableCreateIngredient"), "error");
          }
        );

      await getData();

      setIsLoading(false);
    }
  }

  const label: ReactNode = (
    <Input
      autoFocus
      value={formData.label}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        let text: string = event.target.value;
        if (text.length > 0)
          text = text.charAt(0).toUpperCase() + text.slice(1);

        onInputChange("label", text);
      }}
      placeholder={t("insertName")}
      error={errors.label}
    />
  );

  const icon: ReactNode = (
    <Input
      autoFocus
      value={formData.icon}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onInputChange("icon", event.target.value)
      }
      placeholder={t("insertIcon")}
      error={errors.icon}
    />
  );

  const button: ReactNode = (
    <Button
      type="submit"
      variant="liquid-glass"
      icon={
        isEditMode ? (
          <SaveIcon className="text-xl text-white" />
        ) : (
          <CreateIcon className="text-xl text-white" />
        )
      }
      text={t(isEditMode ? "save" : "create")}
    />
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 justify-center items-center min-h-[70vh]"
    >
      <LiquidGlass className="w-fit px-20 py-20 mobile:px-10 mobile:py-10 mobile:w-full flex flex-col justify-center items-center gap-10">
        {label}
        {icon}
        {button}
      </LiquidGlass>
    </form>
  );
};

export default AdminIngredient;
