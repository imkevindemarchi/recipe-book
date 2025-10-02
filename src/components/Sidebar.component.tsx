import React, { FC, ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useLocation, useNavigate } from "react-router";

// Api
import { AUTH_API } from "../api";

// Assets
import logoImg from "../assets/images/logo.png";
import { LoginIcon, LogoutIcon, WebIcon } from "../assets/icons";

// Components
import LiquidGlass from "./LiquidGlass.component";
import LanguageSelector from "./LanguageSelector.component";

// Contexts
import { SidebarContext, TSidebarContext } from "../providers/sidebar.provider";
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";
import { AuthContext, TAuthContext } from "../providers/auth.provider";
import { PopupContext, TPopupContext } from "../providers/popup.provider";

// Types
import { ADMIN_ROUTES, ROUTES, TRoute } from "../routes";
import { THTTPResponse } from "../types";

// Utils
import { removeFromStorage, setToStorage } from "../utils";

interface IProps {
  isAdminSection: boolean;
}

const Sidebar: FC<IProps> = ({ isAdminSection }) => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const routes: TRoute[] = isAdminSection ? ADMIN_ROUTES : ROUTES;
  const { isOpen, onStateChange: onSidebarStateChange }: TSidebarContext =
    useContext(SidebarContext) as TSidebarContext;
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { setIsUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;

  const currentPaths: string[] = pathname.split("/");
  const currentPathSection: string = currentPaths[isAdminSection ? 2 : 1];

  function goToHome(): void {
    navigate(isAdminSection ? "/admin" : "/");
    onSidebarStateChange();
  }

  function onRouteChange(path: string): void {
    navigate(path);
    onSidebarStateChange();
  }

  function onLanguageChange(countryCode: string): void {
    changeLanguage(countryCode);
    setToStorage("language", countryCode);
  }

  async function onLogout(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(AUTH_API.logout()).then((response: THTTPResponse) => {
      if (response.hasSuccess) {
        navigate("/log-in");
        removeFromStorage("token");
        setIsUserAuthenticated(false);
      } else openPopup(t("logoutError"), "error");
    });
    onSidebarStateChange();

    setIsLoading(false);
  }

  function onLogin(): void {
    navigate("/admin");
    onSidebarStateChange();
  }

  function onWeb(): void {
    navigate("/");
    onSidebarStateChange();
  }

  const logo: ReactNode = (
    <LiquidGlass borderRadius={20} onClick={goToHome}>
      <img
        src={logoImg}
        alt={t("imgNotFound")}
        className="w-28 h-28 hover:opacity-50 transition-all duration-300 cursor-pointer"
      />
    </LiquidGlass>
  );

  const routesComponent: ReactNode = (
    <div className="flex flex-col justify-center text-center items-center gap-5">
      {routes.map((route: TRoute, index: number) => {
        const isRouteHidden: boolean = route.isHidden ? true : false;
        const routePathSection: string =
          route.path.split("/")[isAdminSection ? 2 : 1];
        const isRouteActive: boolean = routePathSection === currentPathSection;

        return !isRouteHidden && isRouteActive ? (
          <LiquidGlass key={index} className="px-5 py-2">
            <span className="text-2xl text-white font-bold">
              {t(route.name).toUpperCase()}
            </span>
          </LiquidGlass>
        ) : (
          !isRouteHidden && (
            <div
              key={index}
              onClick={() => onRouteChange(route.path)}
              className="px-5 py-2 cursor-pointer"
            >
              <span className="text-2xl text-white font-bold">
                {t(route.name).toUpperCase()}
              </span>
            </div>
          )
        );
      })}
    </div>
  );

  const languageSelector: ReactNode = (
    <LanguageSelector value={language} onChange={onLanguageChange} />
  );

  const loginIcon: ReactNode = (
    <LiquidGlass className="w-10 h-10 flex justify-center items-center">
      <LoginIcon onClick={onLogin} className="w-6 h-6 text-white" />
    </LiquidGlass>
  );

  const webIcon: ReactNode = (
    <LiquidGlass className="w-10 h-10 flex justify-center items-center">
      <WebIcon onClick={onWeb} className="w-6 h-6 text-white" />
    </LiquidGlass>
  );

  const logoutIcon: ReactNode = (
    <LiquidGlass className="w-10 h-10 flex justify-center items-center">
      <LogoutIcon onClick={onLogout} className="w-6 h-6 text-white" />
    </LiquidGlass>
  );

  return (
    <LiquidGlass
      className={`fixed left-0 w-full h-full flex justify-center items-center flex-col gap-10 desktop:hidden ${
        isOpen ? "top-0 opacity-100" : "top-[-100%] opacity-0"
      }`}
      borderRadius={0}
      borderBottomRadius={50}
      zIndex={150}
      blur={10}
    >
      {logo}
      {routesComponent}
      <div className="flex items-center gap-5">
        {languageSelector}
        {!isAdminSection ? loginIcon : webIcon}
        {isAdminSection && logoutIcon}
      </div>
    </LiquidGlass>
  );
};

export default Sidebar;
