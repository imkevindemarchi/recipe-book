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
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { Grid } from "@mui/material";

// Api
import { CATEGORY_API, IMAGE_API, INGREDIENT_API, RECIPE_API } from "../../api";

// Assets
import { CreateIcon, DeleteIcon, DragIcon, SaveIcon } from "../../assets/icons";

// Components
import {
  Button,
  Input,
  LiquidGlass,
  ImageSelector,
  Autocomplete,
  Textarea,
} from "../../components";

// Contexts
import { PopupContext, TPopupContext } from "../../providers/popup.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";

// Types
import {
  TCategory,
  THTTPResponse,
  TIngredient,
  TRecipe,
  TRecipeIngredient,
} from "../../types";
import { IAutocompleteValue } from "../../components/Autocomplete.component";
import { TValidation } from "../../utils/validation.util";

// Utils
import {
  setPageTitle,
  validateFormField,
  validateFormImage,
} from "../../utils";

type TImage = { image: File | null };

const DEFAULT_STATE: TRecipe & TImage = {
  id: null,
  name: "",
  image: null,
  category: null,
  createdDate: new Date(),
  ingredients: null,
  isFavourite: false,
  people: null,
  procedure: null,
  time: "",
};

type TErrors = {
  image: TValidation;
  name: TValidation;
  category: TValidation;
};

const ERRORS_DEFAULT_STATE: TErrors = {
  image: {
    isValid: true,
  },
  name: {
    isValid: true,
  },
  category: {
    isValid: true,
  },
};

type TIngredientErrors = {
  ingredient: TValidation;
  quantity: TValidation;
};

const INGREDIENTS_ERRORS_DEFAULT_STATE: TIngredientErrors = {
  ingredient: {
    isValid: true,
  },
  quantity: {
    isValid: true,
  },
};

const INGREDIENT_DEFAULT_STATE: TRecipeIngredient = {
  id: null,
  label: "",
  quantity: "",
  icon: "",
};

interface ICustomButton {
  label: string;
  icon: any;
  onClick?: (event: FormEvent<Element>) => Promise<void>;
}

type TStepErrors = {
  step: TValidation;
};

const STEPS_ERRORS_DEFAULT_STATE: TStepErrors = {
  step: {
    isValid: true,
  },
};

const AdminRecipe: FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TRecipe & TImage>(DEFAULT_STATE);
  const [errors, setErrors] = useState<TErrors>(ERRORS_DEFAULT_STATE);
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { recipeId } = useParams();
  const navigate: NavigateFunction = useNavigate();
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [ingredientsFormData, setIngredientsFormData] =
    useState<TRecipeIngredient>(INGREDIENT_DEFAULT_STATE);
  const [ingredientsErrors, setIngredientsErrors] = useState<TIngredientErrors>(
    INGREDIENTS_ERRORS_DEFAULT_STATE
  );
  const [step, setStep] = useState<string>("");
  const [stepErrors, setStepErrors] = useState<TStepErrors>(
    STEPS_ERRORS_DEFAULT_STATE
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { pathname } = useLocation();

  const isEditMode: boolean = recipeId ? true : false;

  setPageTitle(isEditMode ? t("editRecipe") : t("newRecipe"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.all([CATEGORY_API.getAll(), INGREDIENT_API.getAll()]).then(
      (response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess)
          setCategories(response[0].data);
        else openPopup(t("unableLoadCategories"), "error");

        if (response[1] && response[1].hasSuccess)
          setIngredients(response[1].data);
        else openPopup(t("unableLoadIngredients"), "error");
      }
    );

    if (isEditMode)
      await Promise.resolve(RECIPE_API.get(recipeId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadRecipe"), "error");
        }
      );

    setIsLoading(false);
  }

  function onInputChange(
    propLabel: keyof TRecipe | keyof TImage,
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
    const isNameValid: TValidation = validateFormField(formData.name as string);
    const isCategoryValid: TValidation = validateFormField(
      formData.category?.label as string
    );

    const isFormValid: boolean =
      isImageValid.isValid && isNameValid.isValid && isCategoryValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        image: {
          isValid: isImageValid.isValid,
          message: isImageValid.message ? t(isImageValid.message) : null,
        },
        name: {
          isValid: isNameValid.isValid,
          message: isNameValid.message ? t(isNameValid.message) : null,
        },
        category: {
          isValid: isCategoryValid.isValid,
          message: isCategoryValid.message ? t(isCategoryValid.message) : null,
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

      const payload: Partial<TRecipe> = {
        name: formData.name,
        category: formData.category,
        createdDate: formData.createdDate,
        isFavourite: false,
        people: formData.people,
        time: formData.time,
        procedure: formData.procedure,
        ingredients: formData.ingredients,
      };

      if (isEditMode)
        await Promise.resolve(
          RECIPE_API.update(payload, recipeId as string)
        ).then(async (recipeRes: THTTPResponse) => {
          if (recipeRes && recipeRes.hasSuccess)
            if (isImageUpdated && formData.image)
              await Promise.resolve(IMAGE_API.delete(recipeRes.data)).then(
                async (deletedImageRes: THTTPResponse) => {
                  if (deletedImageRes && deletedImageRes.hasSuccess) {
                    await Promise.resolve(
                      IMAGE_API.add(
                        formData.id as string,
                        formData.image as File
                      )
                    ).then((imageRes: THTTPResponse) => {
                      if (imageRes && imageRes.hasSuccess)
                        openPopup(t("recipeSuccessfullyUpdated"), "success");
                      else openPopup(t("unableUpdateImage"), "error");
                    });
                  } else openPopup(t("unableRemoveImage"), "error");
                }
              );
            else openPopup(t("recipeSuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateRecipe"), "error");
        });
      else
        await Promise.resolve(RECIPE_API.create(payload)).then(
          async (recipeRes: THTTPResponse) => {
            if (recipeRes && recipeRes.hasSuccess) {
              await Promise.resolve(
                IMAGE_API.add(recipeRes.data, formData.image as File)
              ).then((imageRes: THTTPResponse) => {
                if (imageRes && imageRes.hasSuccess) {
                  openPopup(t("recipeSuccessfullyCreated"), "success");
                  navigate(`/admin/recipes/edit/${recipeRes.data}`);
                } else openPopup(t("unableLoadImage"), "error");
              });
            } else openPopup(t("unableCreateRecipe"), "error");
          }
        );

      await getData();

      setIsLoading(false);
    }
  }

  function validateIngredientsForm(): boolean {
    const isIngredientValid: TValidation = validateFormField(
      ingredientsFormData?.label as string
    );
    const isQuantityValid: TValidation = validateFormField(
      (ingredientsFormData?.quantity as string)?.toString()
    );

    const isFormValid: boolean =
      isIngredientValid.isValid && isQuantityValid.isValid;

    if (isFormValid) return true;
    else {
      setIngredientsErrors((prevState: any) => ({
        ...prevState,
        ingredient: {
          isValid: isIngredientValid.isValid,
          message: isIngredientValid.message
            ? t(isIngredientValid.message)
            : null,
        },
        quantity: {
          isValid: isQuantityValid.isValid,
          message: isQuantityValid.message ? t(isQuantityValid.message) : null,
        },
      }));

      return false;
    }
  }

  function onAddIngredient(event: FormEvent): void {
    event.preventDefault();

    const isFormValid: boolean = validateIngredientsForm();
    const ingredientAlreadyExists: boolean = formData.ingredients?.find(
      (ingredient: TRecipeIngredient) =>
        ingredient.label?.toLowerCase().trim() ===
        ingredientsFormData.label.toLowerCase().trim()
    )
      ? true
      : false;

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else if (ingredientAlreadyExists)
      openPopup(t("ingredientAlreadyExists"), "warning");
    else {
      const ingredients: TRecipeIngredient[] = [
        ...(formData.ingredients || []),
      ];
      ingredients.push({
        id: ingredientsFormData?.id as string,
        label: ingredientsFormData?.label as string,
        quantity: ingredientsFormData?.quantity as string,
        icon: ingredientsFormData.icon,
      });

      onInputChange("ingredients", ingredients);
      setIngredientsFormData(INGREDIENT_DEFAULT_STATE);
    }
  }

  function onIngredientsInputChange(
    propLabel: keyof TRecipeIngredient,
    value: any
  ): void {
    setIngredientsFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setIngredientsErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function onDeleteIngredient(ingredient: TRecipeIngredient): void {
    const ingredients: TRecipeIngredient[] = [...(formData.ingredients || [])];

    const elabIngredients: TRecipeIngredient[] = ingredients.filter(
      (item: TRecipeIngredient) => item.id !== ingredient.id
    );

    onInputChange("ingredients", elabIngredients);
  }

  function validateStepForm(): boolean {
    const isStepValid: TValidation = validateFormField(step as string);

    const isFormValid: boolean = isStepValid.isValid;

    if (isFormValid) return true;
    else {
      setStepErrors((prevState: any) => ({
        ...prevState,
        step: {
          isValid: isStepValid.isValid,
          message: isStepValid.message ? t(isStepValid.message) : null,
        },
      }));

      return false;
    }
  }

  function onAddStep(event: FormEvent): void {
    event.preventDefault();

    const isFormValid: boolean = validateStepForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      const procedure: string[] = formData.procedure
        ? [...formData.procedure]
        : [];
      procedure.push(step as string);

      onInputChange("procedure", procedure);
      setStep("");
    }
  }

  function onDeleteStep(step: string): void {
    const procedure: string[] = [...(formData.procedure || [])];

    const elabProcedure: string[] = procedure.filter(
      (item: string) => item !== step
    );

    onInputChange("procedure", elabProcedure);
  }

  function onDragStart(index: number): void {
    setDraggedIndex(index);
  }

  function onDragOver(event: any): void {
    event.preventDefault();
  }

  function onDragDrop(index: number): void {
    if (draggedIndex === null) return;

    const procedure: string[] = formData.procedure as string[];
    const [movedItem] = procedure.splice(draggedIndex, 1);
    procedure.splice(index, 0, movedItem);

    onInputChange("procedure", procedure);
    setDraggedIndex(null);
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

  const name: ReactNode = (
    <Input
      autoFocus
      value={formData.name}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        let text: string = event.target.value;
        if (text.length > 0)
          text = text.charAt(0).toUpperCase() + text.slice(1);

        onInputChange("name", text);
      }}
      placeholder={t("insertName")}
      error={errors.name}
    />
  );

  const category: ReactNode = (
    <Autocomplete
      value={formData.category as IAutocompleteValue}
      onChange={(value: Partial<TCategory>) => onInputChange("category", value)}
      placeholder={t("insertCategory")}
      error={errors.category}
      data={categories as IAutocompleteValue[]}
    />
  );

  const time: ReactNode = (
    <Input
      value={formData.time}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onInputChange("time", event.target.value)
      }
      placeholder={t("insertTime")}
    />
  );

  const people: ReactNode = (
    <Input
      type="number"
      value={formData.people}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onInputChange("people", event.target.value)
      }
      placeholder={t("insertPeople")}
    />
  );

  const CustomButton: FC<ICustomButton> = ({ label, icon, onClick }) => (
    <Button
      type="submit"
      onClick={onClick && onClick}
      variant="liquid-glass"
      text={label}
      icon={icon}
    />
  );

  const form: ReactNode = (
    <form
      onSubmit={onSubmit}
      className="w-full h-full flex flex-col gap-5 justify-center items-center min-h-[70vh]"
    >
      <LiquidGlass className="w-fit px-20 py-20 mobile:px-10 mobile:py-10 mobile:w-full flex flex-col justify-center items-center gap-10">
        {imageSelector}
        {image}
        <Grid container columnSpacing={5} rowSpacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>{name}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{category}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{time}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>{people}</Grid>
        </Grid>
        {!isEditMode && (
          <CustomButton
            label={t(isEditMode ? "save" : "create")}
            icon={
              isEditMode ? (
                <SaveIcon className="text-xl text-white" />
              ) : (
                <CreateIcon className="text-xl text-white" />
              )
            }
          />
        )}
      </LiquidGlass>
    </form>
  );

  const sectionTitle = (title: string): ReactNode => (
    <span className="text-white text-2xl">{t(title)}</span>
  );

  const ingredientsForm: ReactNode = (
    <form
      onSubmit={onAddIngredient}
      className="w-full h-full flex flex-col gap-5 justify-center items-center"
    >
      <LiquidGlass className="w-full px-20 py-20 mobile:px-10 mobile:py-10 mobile:w-full flex flex-col justify-center items-center gap-10">
        <Grid container columnSpacing={5} rowSpacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              value={{
                id: ingredientsFormData.id,
                label: ingredientsFormData.label,
              }}
              onChange={(value: Partial<TRecipeIngredient>) => {
                onIngredientsInputChange("id", value.id);
                onIngredientsInputChange("label", value.label);
                onIngredientsInputChange("icon", value.icon);
                setIngredientsErrors((prevState: any) => {
                  return {
                    ...prevState,
                    ingredient: {
                      isValid: true,
                    },
                  };
                });
              }}
              placeholder={t("insertIngredient")}
              error={ingredientsErrors.ingredient}
              data={ingredients}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Input
              value={ingredientsFormData.quantity}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onIngredientsInputChange("quantity", event.target.value)
              }
              placeholder={t("insertQuantity")}
              error={ingredientsErrors.quantity}
            />
          </Grid>
        </Grid>
        <CustomButton
          label={t("add")}
          icon={<CreateIcon className="text-white text-xl" />}
        />
      </LiquidGlass>
    </form>
  );

  const ingredientsList: ReactNode = (
    <div className="flex flex-wrap gap-5 justify-center items-center">
      {formData.ingredients?.map(
        (ingredient: TRecipeIngredient, index: number) => {
          const ingredientLabel: string = `${ingredient.quantity} - ${ingredient.label} ${ingredient.icon}`;

          return (
            <LiquidGlass
              key={index}
              className="p-2 py-1 pl-3 flex items-center gap-3"
            >
              <span className="text-white">{ingredientLabel}</span>
              <LiquidGlass
                onClick={() => onDeleteIngredient(ingredient)}
                className="p-2 flex justify-center items-center cursor-pointer hover:opacity-50"
              >
                <DeleteIcon className="text-white" />
              </LiquidGlass>
            </LiquidGlass>
          );
        }
      )}
    </div>
  );

  const ingredientsNoData: ReactNode = (
    <span className="text-white">{t("noIngredients")}</span>
  );

  const ingredientsComponent: ReactNode = (
    <LiquidGlass className="w-full h-full flex justify-center items-center p-5">
      {formData.ingredients && formData.ingredients.length > 0
        ? ingredientsList
        : ingredientsNoData}
    </LiquidGlass>
  );

  const procedureForm: ReactNode = (
    <form
      onSubmit={onAddStep}
      className="w-full h-full flex flex-col gap-5 justify-center items-center"
    >
      <LiquidGlass className="w-full px-20 py-20 mobile:px-10 mobile:py-10 mobile:w-full flex flex-col justify-center items-center gap-10">
        <Textarea
          value={step as string}
          onChange={(value: string) => setStep(value)}
          placeholder={t("insertStep")}
          error={stepErrors.step}
        />
        <CustomButton
          label={t("add")}
          icon={<CreateIcon className="text-white text-xl" />}
        />
      </LiquidGlass>
    </form>
  );

  const procedureList: ReactNode = (
    <div className="flex flex-col gap-5 justify-center items-center w-full">
      {formData.procedure?.map((step: string, index: number) => {
        return (
          <LiquidGlass
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={() => onDragDrop(index)}
            key={index}
            className="px-5 py-2 flex items-center justify-between gap-5 flex-wrap overflow-hidden w-full cursor-grab"
          >
            <DragIcon className="text-white text-3xl mobile:hidden" />
            <div className="max-w-[75%] flex flex-wrap">
              <span className="text-white">{step}</span>
            </div>
            <LiquidGlass
              onClick={() => onDeleteStep(step)}
              className="p-2 flex justify-center items-center cursor-pointer hover:opacity-50"
            >
              <DeleteIcon className="text-white text-xl" />
            </LiquidGlass>
          </LiquidGlass>
        );
      })}
    </div>
  );

  const procedureNoData: ReactNode = (
    <span className="text-white">{t("noProcedure")}</span>
  );

  const procedureComponent: ReactNode = (
    <LiquidGlass className="w-full h-full flex justify-center items-center p-5">
      {formData.procedure && formData.procedure.length > 0
        ? procedureList
        : procedureNoData}
    </LiquidGlass>
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
  }, [pathname]);

  return (
    <div className="flex flex-col gap-10">
      {form}
      {isEditMode && (
        <div className="flex flex-col justify-center items-center gap-5">
          {sectionTitle("ingredients")}
          <Grid container columnSpacing={5} rowSpacing={5} className="w-full">
            <Grid size={{ xs: 12, md: 6 }}>{ingredientsForm}</Grid>
            <Grid size={{ xs: 12, md: 6 }}>{ingredientsComponent}</Grid>
          </Grid>
          {sectionTitle("procedure")}
          {procedureForm}
          {procedureComponent}
          <CustomButton
            onClick={onSubmit}
            label={t(isEditMode ? "save" : "create")}
            icon={<SaveIcon className="text-white text-xl" />}
          />
        </div>
      )}
    </div>
  );
};

export default AdminRecipe;
