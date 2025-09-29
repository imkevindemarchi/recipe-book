import { ReactNode } from "react";

// Pages
import { Login } from "./pages";
import {
  AdminCategories,
  AdminCategory,
  AdminIngredients,
} from "./pages/admin";

export type TRoute = {
  path: string;
  name: string;
  element: ReactNode;
  isHidden?: boolean;
};

export const ROUTES: TRoute[] = [
  {
    path: "/log-in",
    name: "login",
    element: <Login />,
    isHidden: true,
  },
];

export const ADMIN_ROUTES: TRoute[] = [
  {
    path: "/admin",
    name: "dashboard",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/admin/recipes",
    name: "recipes",
    element: <></>,
  },
  {
    path: "/admin/recipes/new",
    name: "recipes",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/admin/recipes/edit/:recipeId",
    name: "recipes",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/admin/ingredients",
    name: "ingredients",
    element: <AdminIngredients />,
  },
  {
    path: "/admin/ingredients/new",
    name: "ingredient",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/admin/ingredients/edit/:ingredientId",
    name: "ingredient",
    element: <></>,
    isHidden: true,
  },
  {
    path: "/admin/categories",
    name: "categories",
    element: <AdminCategories />,
  },
  {
    path: "/admin/categories/new",
    name: "category",
    element: <AdminCategory />,
    isHidden: true,
  },
  {
    path: "/admin/categories/edit/:categoryId",
    name: "category",
    element: <AdminCategory />,
    isHidden: true,
  },
];
