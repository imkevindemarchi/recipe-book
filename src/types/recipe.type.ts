// Types
import { TCategory } from "./category.type";
import { TRecipeIngredient } from "./ingredient.type";

export type TRecipe = {
  id: string | null;
  name: string;
  time: string;
  isFavourite: boolean;
  people: number | null;
  createdDate: Date | string;
  category: TCategory | null;
  procedure: string[] | null;
  ingredients: TRecipeIngredient[] | null;
};
