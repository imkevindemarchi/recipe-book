import { FC, useContext } from "react";

// Assets
import logoImg from "../../assets/images/logo.png";

// Contexts
import { ThemeContext } from "../../providers";

// Types
import { ThemeContextI } from "../../types";

// Utilities
import { setPageTitle } from "../../utilities";

const Dashboard: FC = () => {
    const { state: theme } = useContext(ThemeContext) as ThemeContextI;

    const isDarkMode: boolean = theme === "dark";

    setPageTitle("Dasboard");

    const image = (
        <img
            src={logoImg}
            className="w-[50vh] object-contain"
            alt="Impossibile visualizzare l'immagine."
        />
    );

    const title = (
        <span
            className={`absolute text-[3em] uppercase tracking-[1em] font-bold transition-all duration-200 mobile:text-center mobile:tracking-[0.3em] mobile:text-[2em]
                ${isDarkMode ? "text-white" : "text-black"}
            `}
            style={{
                textShadow: `0px 0px 5px ${isDarkMode ? "black" : "white"}`,
            }}
        >
            {process.env.REACT_APP_WEBSITE_NAME}
        </span>
    );

    return (
        <div className="flex justify-center items-center relative">
            {image}
            {title}
        </div>
    );
};

export default Dashboard;
