import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

// Assets
import { EmailIcon, LocationIcon } from "../assets/icons";

// Types
import { FooterI, RouteT } from "../types";

interface ColumnI {
    children: ReactNode;
    title: string | undefined;
}

const Footer: FC<FooterI> = ({ isDarkMode, routes, urlSection }) => {
    const Column = ({ children, title }: ColumnI) => (
        <div className="flex flex-col pt-5 gap-3">
            <span
                className={`transition-all duration-200 text-xl uppercase font-bold
                    ${isDarkMode ? "text-white" : "text-black"}
                `}
            >
                {title}
            </span>
            {children}
        </div>
    );

    const columns = (
        <div className="flex flex-row justify-between mobile:flex-col mobile:gap-10">
            <Column title={process.env.REACT_APP_WEBSITE_NAME}>
                <a
                    href={`mailto: ${process.env.REACT_APP_EMAIL}`}
                    className={`flex flex-row items-center gap-2 hover:text-primary transition-all duration-200
                        ${isDarkMode ? "text-white" : "text-black"}
                    `}
                >
                    <EmailIcon className="text-2xl" />
                    <span className="font-bold text-lg mobile:text-base">
                        {process.env.REACT_APP_EMAIL}
                    </span>
                </a>
                <div
                    className={`flex flex-row items-center gap-2 transition-all duration-200
                        ${isDarkMode ? "text-white" : "text-black"}
                    `}
                >
                    <LocationIcon className="text-2xl" />
                    <span className="text-lg mobile:text-base">
                        {process.env.REACT_APP_COUNTRY}
                    </span>
                </div>
            </Column>
            <Column title="Collegamenti">
                <div className="text-center flex flex-col gap-3 mobile:text-left">
                    {routes.map((route: RouteT) => {
                        const currentSection: string = route.path.split("/")[1];
                        const isRouteActive: boolean =
                            currentSection === urlSection;

                        return (
                            !route.isHidden && (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className={`hover:text-primary transition-all duration-200 mobile:text-lg
                                        ${
                                            isRouteActive &&
                                            "text-primary font-bold"
                                        }
                                        ${
                                            isDarkMode && !isRouteActive
                                                ? "text-white"
                                                : "text-black"
                                        }
                                    `}
                                >
                                    {route.name}
                                </Link>
                            )
                        );
                    })}
                </div>
            </Column>
        </div>
    );

    const copyrightText: string = `@ ${process.env.REACT_APP_YEAR} - ${process.env.REACT_APP_WEBSITE_NAME}, made by
            Kevin De Marchi - All rights reserved`;

    const copyright = (
        <span
            className={`transition-all duration-200 text-md text-left mobile:text-center
                ${isDarkMode ? "text-gray-300" : "text-darkgray"}
            `}
        >
            {copyrightText}
        </span>
    );

    return (
        <div
            className={`transition-all duration-200 absolute bottom-0 w-full py-20 px-40 flex flex-col gap-10 mobile:px-5
                ${isDarkMode ? "bg-black" : "bg-white"}
            `}
        >
            {columns}
            {copyright}
        </div>
    );
};

export default Footer;
