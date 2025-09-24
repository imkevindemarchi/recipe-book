import { FC } from "react";
import { Route, Routes } from "react-router";

// Assets
import { ROUTES, TRoute } from "./routes";

// Components
import { Layout } from "./components";

const App: FC = () => {
  return (
    <Layout>
      <Routes>
        {ROUTES.map((route: TRoute, index: number) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Layout>
  );
};

export default App;
