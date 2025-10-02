import React, { FC, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useLocation, useNavigate } from "react-router";

// Api
import { AUTH_API } from "../api";

// Assets
import logoImg from "../assets/images/logo.png";
import { LogoutIcon } from "../assets/icons";

// Components
import LiquidGlass from "./LiquidGlass.component";
import LanguageSelector from "./LanguageSelector.component";

// Contexts
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

const Navbar: FC<IProps> = ({ isAdminSection }) => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const { pathname } = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { setIsUserAuthenticated }: TAuthContext = useContext(
    AuthContext
  ) as TAuthContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [isOnTopOfPage, setIsOnTopOfPage] = useState<boolean>(true);

  const currentPaths: string[] = pathname.split("/");
  const currentPathSection: string = currentPaths[isAdminSection ? 2 : 1];

  const routes: TRoute[] = isAdminSection ? ADMIN_ROUTES : ROUTES;

  function goToHome(): void {
    navigate(isAdminSection ? "/admin" : "/");
  }

  function onRouteChange(path: string): void {
    navigate(path);
  }

  function onLanguageChange(countryCode: string): void {
    changeLanguage(countryCode);
    setToStorage("language", countryCode);
  }

  async function onLogout() {
    setIsLoading(true);

    await Promise.resolve(AUTH_API.logout()).then((response: THTTPResponse) => {
      if (response.hasSuccess) {
        navigate("/log-in");
        removeFromStorage("token");
        setIsUserAuthenticated(false);
      } else openPopup(t("logoutError"), "error");
    });

    setIsLoading(false);
  }

  const logo: ReactNode = (
    <LiquidGlass
      borderRadius={20}
      onClick={goToHome}
      className={`${isOnTopOfPage ? "w-20 h-20" : "w-14 h-14"}`}
    >
      <img
        src={logoImg}
        alt={t("imgNotFound")}
        onClick={goToHome}
        className="w-full hover:opacity-50 transition-all duration-300 cursor-pointer"
      />
    </LiquidGlass>
  );

  const routesComponent: ReactNode = (
    <LiquidGlass className="flex items-center">
      {routes.map((route: TRoute, index: number) => {
        const isRouteHidden: boolean = route.isHidden ? true : false;
        const routePathSection: string =
          route.path.split("/")[isAdminSection ? 2 : 1];
        const isRouteActive: boolean = routePathSection === currentPathSection;

        return !isRouteHidden && isRouteActive ? (
          <LiquidGlass key={index} className="px-5 py-2">
            <span className="text-white font-bold">
              {t(route.name).toUpperCase()}
            </span>
          </LiquidGlass>
        ) : (
          !isRouteHidden && (
            <div
              key={index}
              onClick={() => onRouteChange(route.path)}
              className="px-5 py-2 cursor-pointer hover:opacity-50 transition-all duration-300"
            >
              <span className="text-white font-bold">
                {t(route.name).toUpperCase()}
              </span>
            </div>
          )
        );
      })}
    </LiquidGlass>
  );

  const languageSelector: ReactNode = (
    <LanguageSelector value={language} onChange={onLanguageChange} />
  );

  const logoutIcon: ReactNode = (
    <LiquidGlass
      onClick={onLogout}
      className="w-10 h-10 flex justify-center items-center hover:opacity-50 cursor-pointer"
    >
      <LogoutIcon className="text-white text-xl" />
    </LiquidGlass>
  );

  window.addEventListener("scroll", () => {
    setIsOnTopOfPage(window.scrollY === 0);
  });

  return (
    <LiquidGlass
      borderRadius={0}
      borderBottomRadius={50}
      blur={10}
      style={{ zIndex: 100 }}
      className={`w-full fixed flex items-center px-20 justify-between mobile:hidden ${
        isOnTopOfPage ? "h-36" : "h-16"
      }`}
    >
      <div className="flex items-center gap-5">
        {logo}
        {routesComponent}
      </div>
      <div className="flex items-center gap-5">
        {languageSelector}
        {isAdminSection && logoutIcon}
      </div>
    </LiquidGlass>
  );
};

export default Navbar;
