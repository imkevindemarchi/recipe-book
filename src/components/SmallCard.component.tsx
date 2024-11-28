import { FC } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// Types
import { SmallCardI } from "../types";

const SmallCard: FC<SmallCardI> = ({ title, backgroundImage, path }) => {
    const navigate: NavigateFunction = useNavigate();

    function pageHandler(path: string): void {
        navigate(path);
    }

    return (
        <div
            onClick={() => path && pageHandler(path)}
            className="relative text-center flex justify-center items-center cursor-pointer transition-all duration-200 hover:opacity-80"
        >
            <img
                src={backgroundImage}
                alt="Impossibile visualizzare l'immagine."
                className="w-full h-full rounded-lg brightness-[0.8]"
            />
            <span className="absolute text-white uppercase font-bold text-xl">
                {title}
            </span>
        </div>
    );
};

export default SmallCard;
