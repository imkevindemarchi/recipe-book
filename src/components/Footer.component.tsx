import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useLocation, useNavigate } from "react-router";

// Assets
import {
  EmailIcon,
  GithubIcon,
  LinkedInIcon,
  LocationIcon,
} from "../assets/icons";
import { ROUTES, TRoute } from "../routes";
import { ISocialNetwork, SOCIAL_NETWORKS } from "../assets";

// Components
import LiquidGlass from "./LiquidGlass.component";

interface IColumn {
  title: string;
  children: ReactNode;
}

const Footer: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const currentPaths: string[] = pathname.split("/");
  const currentPathSection: string = currentPaths[1];
  const copyrightText: string = `@ ${process.env.REACT_APP_YEAR} - ${process.env.REACT_APP_WEBSITE_NAME}, made by Kevin De Marchi - All rights reserved`;

  function onGoToPage(url: string): void {
    navigate(url);
  }

  function onOpenSocialNetwork(link: string): void {
    window.open(link, "_blank");
  }

  const Column: FC<IColumn> = ({ title, children }) => {
    return (
      <div className="flex flex-col gap-5">
        <span className="text-2xl font-bold uppercase text-white">{title}</span>
        {children}
      </div>
    );
  };

  const informations: ReactNode = (
    <Column title={process.env.REACT_APP_WEBSITE_NAME as string}>
      <div className="flex flex-col gap-2">
        <a
          href={`mailto: ${process.env.REACT_APP_EMAIL}`}
          className="flex flex-row items-center text-base gap-1 text-white hover:text-primary transition-all duration-300"
        >
          <EmailIcon className="text-2xl" />
          <span>{process.env.REACT_APP_EMAIL}</span>
        </a>
        <div className="flex flex-row items-center text-base gap-1 text-white">
          <LocationIcon className="text-2xl" />
          <span className="text-white">{process.env.REACT_APP_COUNTRY}</span>
        </div>
      </div>
    </Column>
  );

  const links: ReactNode = (
    <Column title={t("links")}>
      <div className="flex justify-center flex-col items-center">
        {ROUTES.map((route: TRoute, index: number) => {
          const isRouteHidden: boolean = route.isHidden ? true : false;
          const routePathSection: string = route.path.split("/")[1];
          const isRouteActive: boolean =
            routePathSection === currentPathSection;

          return !isRouteHidden && isRouteActive ? (
            <LiquidGlass key={index} className="px-5 py-2">
              <span className="text-white">{t(route.name)}</span>
            </LiquidGlass>
          ) : (
            !isRouteHidden && (
              <div
                key={index}
                onClick={() => onGoToPage(route.path)}
                className="px-5 py-2 cursor-pointer hover:opacity-50 transition-all duration-300"
              >
                <span className="text-white">{t(route.name)}</span>
              </div>
            )
          );
        })}
      </div>
    </Column>
  );

  const socialNetworks: ReactNode = (
    <Column title={t("socialNetworks")}>
      <div className="flex items-center justify-center gap-5">
        {SOCIAL_NETWORKS.map((socialNetwork: ISocialNetwork, index: number) => {
          return (
            <LiquidGlass
              key={index}
              onClick={() => onOpenSocialNetwork(socialNetwork.link)}
              className="w-14 h-14 hover:opacity-50 flex justify-center items-center cursor-pointer"
            >
              {socialNetwork.name === "github" ? (
                <GithubIcon className="text-white text-3xl" />
              ) : (
                socialNetwork.name === "linkedin" && (
                  <LinkedInIcon className="text-white text-3xl" />
                )
              )}
            </LiquidGlass>
          );
        })}
      </div>
    </Column>
  );

  const copyright: ReactNode = (
    <span className="text-sm text-white opacity-80">{copyrightText}</span>
  );

  return (
    <div className="mx-20 relative">
      <LiquidGlass className="absolute bottom-20 w-full py-20 px-20 pb-10 flex flex-col gap-10">
        <div className="flex justify-between">
          {informations}
          {links}
          {socialNetworks}
        </div>
        {copyright}
      </LiquidGlass>
    </div>
  );
};

export default Footer;
