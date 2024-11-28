import { FC } from "react";

// Types
import { CardI } from "../types";

const Card: FC<CardI> = ({ hiddenOnMobile, children }) => {
    return (
        <div
            className={`bg-primary-transparent-2 p-20 rounded-3xl w-full mobile:py-10 mobile:px-5
                ${
                    hiddenOnMobile &&
                    "mobile:bg-transparent mobile:p-0 mobile:rounded-none mobile:py-0 mobile:px-0"
                }
            `}
        >
            {children}
        </div>
    );
};

export default Card;
