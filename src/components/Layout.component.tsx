import { FC, useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// Api
import { AUTH_API } from "../api";

// Assets
import { ADMIN_ROUTES, ROUTES } from "../routes";

// Components
import Loader from "./Loader.component";
import Snackbar from "./Snackbar.component";
import Navbar from "./Navbar.component";
import Hamburger from "./Hamburger.component";
import Sidebar from "./Sidebar.component";
import BackToTopButton from "./BackToTopButton.component";
import Footer from "./Footer.component";

// Contexts
import {
    AuthContext,
    LoaderContext,
    SidebarContext,
    SnackbarContext,
    ThemeContext,
} from "../providers";

// Types
import {
    AuthContextI,
    LayoutI,
    LoaderContextI,
    RouteT,
    SidebarContextI,
    SnackbarContextI,
    ThemeContextI,
} from "../types";

// Utilities
import { removeFromStorage } from "../utilities";

const Layout: FC<LayoutI> = ({ isAdminSection, pathname, children }) => {
    const { state: isLoading } = useContext(LoaderContext) as LoaderContextI;
    const { state: snackbarState, closeHandler: closeSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { state: theme, stateHandler: themeHandler } = useContext(
        ThemeContext
    ) as ThemeContextI;
    const { setState: setIsLoading } = useContext(
        LoaderContext
    ) as LoaderContextI;
    const { setSession } = useContext(AuthContext) as AuthContextI;
    const { activateHandler: activateSnackbar } = useContext(
        SnackbarContext
    ) as SnackbarContextI;
    const { state: sidebarState, stateHandler: sidebarHandler } = useContext(
        SidebarContext
    ) as SidebarContextI;

    const isLoginPage: boolean = pathname.split("/")[1] === "log-in";
    const isStyleGuidePage: boolean = pathname.split("/")[1] === "style-guide";
    const urlSection: string = isAdminSection
        ? pathname.split("/")[2]
        : pathname.split("/")[1];
    const routes: RouteT[] = isAdminSection ? ADMIN_ROUTES : ROUTES;
    const isDarkMode: boolean = theme === "dark";
    const navigate: NavigateFunction = useNavigate();

    async function logoutHandler() {
        setIsLoading(true);

        const res: boolean = await AUTH_API.logout();
        if (res) {
            setSession(null);
            removeFromStorage("session");
            navigate("/log-in");
        } else activateSnackbar("Impossibile effettuare il log out", "error");

        setIsLoading(false);
    }

    const navbar = !isLoginPage && !isStyleGuidePage && (
        <Navbar
            isAdminSection={isAdminSection}
            urlSection={urlSection}
            routes={routes}
            isDarkMode={isDarkMode}
            themeHandler={themeHandler}
            logoutHandler={logoutHandler}
        />
    );

    const sidebar = (
        <Sidebar
            isAdminSection={isAdminSection}
            urlSection={urlSection}
            routes={routes}
            isDarkMode={isDarkMode}
            themeHandler={themeHandler}
            logoutHandler={logoutHandler}
            isActive={sidebarState}
            stateHandler={sidebarHandler}
        />
    );

    const hamburger = !isLoginPage && (
        <Hamburger
            isActive={sidebarState}
            onClick={sidebarHandler}
            isDarkMode={isDarkMode}
        />
    );

    const footer = !isAdminSection && !isLoginPage && !isStyleGuidePage && (
        <Footer
            isDarkMode={isDarkMode}
            routes={routes}
            urlSection={urlSection}
        />
    );

    const loader = <Loader isOpen={isLoading} isDarkMode={isDarkMode} />;

    const snackbar = <Snackbar state={snackbarState} onClose={closeSnackbar} />;

    const backToTopButton = !sidebarState &&
        !isAdminSection &&
        !isLoginPage && <BackToTopButton isDarkMode={isDarkMode} />;

    return (
        <div
            className={`w-full min-h-[100vh] relative
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            {navbar}
            {sidebar}
            {hamburger}
            <div
                style={{
                    background:
                        !isLoginPage && !isAdminSection && !isStyleGuidePage
                            ? `linear-gradient(360deg, #ff9d00 20%, 
                            ${isDarkMode ? "#000000" : "#ffffff"} 70%)`
                            : "",
                }}
                className={`transition-all duration-500 
                    ${sidebarState && "opacity-0"}
                    ${
                        !isStyleGuidePage && !isLoginPage
                            ? "px-96 mobile:px-5 py-56 mobile:py-28"
                            : ""
                    }
                `}
            >
                {children}
            </div>
            {footer}
            {loader}
            {snackbar}
            {backToTopButton}
        </div>
    );
};

export default Layout;
