export type THTTPResponse = {
  data?: any;
  hasSuccess: boolean;
  totalRecords?: number | null;
};

export type TLoginPayload = { email: string; password: string };

export type { TCategory } from "./category.type";

export type { TIngredient, TRecipeIngredient } from "./ingredient.type";

export type { TRecipe } from "./recipe.type";
