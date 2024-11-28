import { FC } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// Types
import { BigCardI } from "../types";

const BigCard: FC<BigCardI> = ({
    backgroundImage,
    time,
    path,
    title,
    isDarkMode,
    className,
    titleClassName,
}) => {
    const navigate: NavigateFunction = useNavigate();

    function pageHandler(path: string): void {
        navigate(path);
    }

    return (
        <div
            onClick={() => path && pageHandler(path)}
            className={
                className
                    ? className
                    : `w-60 h-[400px] bg-white rounded-xl relative cursor-pointer transition-all duration-200 hover:opacity-80 mobile:flex-shrink-0`
            }
        >
            <img
                src={backgroundImage}
                alt="Impossibile visualizzare l'immagine."
                className="w-full h-full object-cover rounded-lg"
            />
            <div
                className={`rounded-full absolute px-3 py-2 top-[-20px] right-[-10px] transition-all duration-200
                    ${isDarkMode ? "bg-white" : "bg-black"}
                `}
            >
                <span
                    className={`text-sm transition-all duration-200
                        ${isDarkMode ? "text-black" : "text-white"}
                    `}
                >
                    {time}
                </span>
            </div>
            <div className="absolute w-full h-20 bottom-5 flex justify-center items-center">
                <div
                    style={{
                        background: "rgba(255, 255, 255, 0.4)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(7.5px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                    className="w-[90%] h-full rounded-lg flex justify-center items-center"
                >
                    <span
                        className={`text-white font-bold text-lg text-ellipsis overflow-hidden flex-nowrap
                            ${titleClassName}
                        `}
                    >
                        {title}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BigCard;
