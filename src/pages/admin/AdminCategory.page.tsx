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
import { CATEGORY_API, IMAGE_API } from "../../api";

// Components
import { Button, Input, LiquidGlass, ImageSelector } from "../../components";

// Contexts
import { PopupContext, TPopupContext } from "../../providers/popup.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";

// Types
import { TCategory } from "../../types/category.type";
import { THTTPResponse } from "../../types";

// Utils
import { setPageTitle } from "../../utils";
import {
  TValidation,
  validateFormField,
  validateFormImage,
} from "../../utils/validation.util";

type TImage = { image: File | null };

const DEFAULT_STATE: TCategory & TImage = {
  id: null,
  label: "",
  image: null,
};

type TErrors = {
  image: TValidation;
  label: TValidation;
};

const ERRORS_DEFAULT_STATE: TErrors = {
  image: {
    isValid: true,
  },
  label: {
    isValid: true,
  },
};

const AdminCategory: FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TCategory & TImage>(DEFAULT_STATE);
  const [errors, setErrors] = useState<TErrors>(ERRORS_DEFAULT_STATE);
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { categoryId } = useParams();
  const navigate: NavigateFunction = useNavigate();

  const isEditMode: boolean = categoryId ? true : false;

  setPageTitle(isEditMode ? t("editCategory") : t("newCategory"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    if (isEditMode)
      await Promise.resolve(CATEGORY_API.get(categoryId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadCategory"), "error");
        }
      );

    setIsLoading(false);
  }

  function onInputChange(
    propLabel: keyof TCategory | keyof TImage,
    value: any
  ): void {
    setFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function validateForm(): boolean {
    const isImageValid: TValidation = validateFormImage(formData.image as File);
    const isLabelValid: TValidation = validateFormField(
      formData.label as string
    );

    const isFormValid: boolean = isImageValid.isValid && isLabelValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        image: {
          isValid: isImageValid.isValid,
          message: isImageValid.message ? t(isImageValid.message) : null,
        },
        label: {
          isValid: isLabelValid.isValid,
          message: isLabelValid.message ? t(isLabelValid.message) : null,
        },
      }));

      return false;
    }
  }

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const isFormValid: boolean = validateForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      setIsLoading(true);

      const payload: Partial<TCategory> = {
        label: formData.label,
      };

      if (isEditMode)
        await Promise.resolve(
          CATEGORY_API.update(payload, categoryId as string)
        ).then(async (categoryRes: THTTPResponse) => {
          if (categoryRes && categoryRes.hasSuccess)
            if (isImageUpdated && formData.image)
              await Promise.resolve(IMAGE_API.delete(categoryRes.data)).then(
                async (deletedImageRes: THTTPResponse) => {
                  if (deletedImageRes && deletedImageRes.hasSuccess) {
                    await Promise.resolve(
                      IMAGE_API.add(
                        formData.id as string,
                        formData.image as File
                      )
                    ).then((imageRes: THTTPResponse) => {
                      if (imageRes && imageRes.hasSuccess)
                        openPopup(t("categorySuccessfullyUpdated"), "success");
                      else openPopup(t("unableUpdateImage"), "error");
                    });
                  } else openPopup(t("unableRemoveImage"), "error");
                }
              );
            else openPopup(t("categorySuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateCategory"), "error");
        });
      else
        await Promise.resolve(CATEGORY_API.create(payload)).then(
          async (categoryRes: THTTPResponse) => {
            if (categoryRes && categoryRes.hasSuccess) {
              await Promise.resolve(
                IMAGE_API.add(categoryRes.data, formData.image as File)
              ).then((imageRes: THTTPResponse) => {
                if (imageRes && imageRes.hasSuccess) {
                  openPopup(t("categorySuccessfullyCreated"), "success");
                  navigate(`/admin/categories/edit/${categoryRes.data}`);
                } else openPopup(t("unableLoadImage"), "error");
              });
            } else openPopup(t("unableCreateCategory"), "error");
          }
        );

      await getData();

      setIsLoading(false);
    }
  }

  const imageSelector: ReactNode = (
    <ImageSelector
      file={formData.image}
      onChange={(file: File) => {
        onInputChange("image", file);
        setIsImageUpdated(true);
      }}
      error={errors.image}
    />
  );

  const image: ReactNode = formData.image && (
    <img
      id="image"
      src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${formData.id}`}
      alt={t("imgNotFound")}
      className="w-60 rounded-lg object-contain"
    />
  );

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

  const button: ReactNode = (
    <Button
      type="submit"
      variant="liquid-glass"
      text={t(isEditMode ? "save" : "create")}
    />
  );

  useEffect(() => {
    if (formData.image && typeof formData.image === "object") {
      let src: string = URL.createObjectURL(formData.image);
      let imagePreview: any = document.getElementById("image");
      if (imagePreview) imagePreview.src = src;
    }
  }, [formData.image]);

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
        {imageSelector}
        {image}
        {label}
        {button}
      </LiquidGlass>
    </form>
  );
};

export default AdminCategory;
