import { ReactNode } from "react";

// Pages
import { Login } from "./pages";

export type TRoute = {
  path: string;
  name: string;
  element: ReactNode;
};

export const ROUTES: TRoute[] = [
  {
    path: "/log-in",
    name: "login",
    element: <Login />,
  },
];
