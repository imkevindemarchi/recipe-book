import { FC, ReactNode, useContext, useEffect } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";

// Api
import { AUTH_API } from "./api";

// Assets
import { ADMIN_ROUTES, ROUTES } from "./routes";

// Components
import { Layout } from "./components";

// Contexts
import { AuthContext } from "./providers";

// Types
import { AuthContextI, RouteT } from "./types";

// Utilities
import { removeFromStorage } from "./utilities";

const App: FC = () => {
    const { pathname }: { pathname: string } = useLocation();
    const navigate = useNavigate();
    const { session: isUserAuthenticated } = useContext(
        AuthContext
    ) as AuthContextI;

    const isAdminSection = pathname.split("/")[1] === "admin";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    async function checkSessionHandler() {
        const res = await AUTH_API.checkSession();

        if (!res || !res.value) {
            removeFromStorage("session");
            navigate("/log-in");
        }
    }

    useEffect(() => {
        if (isAdminSection && isUserAuthenticated) {
            checkSessionHandler();
        }

        // eslint-disable-next-line
    }, []);

    const ProtectedRoute = ({ children }: { children: ReactNode }): any => {
        if (!isUserAuthenticated) {
            return <Navigate to="/log-in" replace />;
        }

        return children;
    };

    const routeElement = (route: RouteT) =>
        route.path === "/log-in" && isUserAuthenticated ? (
            <Navigate to="/admin" replace />
        ) : (
            route.element
        );

    return (
        <Layout isAdminSection={isAdminSection} pathname={pathname}>
            <Routes>
                {ROUTES.map((route: RouteT) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={routeElement(route)}
                    />
                ))}
                {ADMIN_ROUTES.map((adminRoute: RouteT) => (
                    <Route
                        key={adminRoute.path}
                        path={adminRoute.path}
                        element={
                            <ProtectedRoute>
                                {adminRoute.element}
                            </ProtectedRoute>
                        }
                    />
                ))}
            </Routes>
        </Layout>
    );
};

export default App;
