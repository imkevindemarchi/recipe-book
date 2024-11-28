import { FC, MouseEvent, useState } from "react";

// Assets
import { LeftArrowIcon, RightArrowIcon } from "../assets/icons";

// Components
import IconButton from "./IconButton.component";

// Types
import { StepsI } from "../types";

const Steps: FC<StepsI> = ({ data, isDarkMode }) => {
    const [state, setState] = useState<number>(1);

    const isLeftArrowVisible: boolean = state !== 1;
    const isRightArrowVisible: boolean = state !== data.length;

    return data.length > 0 ? (
        <div
            className={`w-full min-h-60 bg-primary-transparent rounded-lg relative flex justify-center items-center
                ${isDarkMode ? "mobile:bg-black" : "mobile:bg-white"}
            `}
        >
            <span className="text-primary font-bold uppercase absolute top-10 left-10 mobile:top-5 mobile:left-5">{`Step ${state}`}</span>
            <div className="flex flex-row items-center w-full">
                <div className="w-[20%] flex justify-center items-center">
                    {isLeftArrowVisible && (
                        <IconButton
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.preventDefault();
                                setState(state - 1);
                            }}
                        >
                            <LeftArrowIcon className="text-3xl text-primary" />
                        </IconButton>
                    )}
                </div>
                <div className="w-[60%] mobile:w-[70%] flex justify-center text-center">
                    <span
                        className={`transition-all duration-200
                            ${isDarkMode ? "text-white" : "text-black"}
                        `}
                    >
                        {data[state - 1]?.step}
                    </span>
                </div>
                <div className="w-[20%] flex justify-center items-center">
                    {isRightArrowVisible && (
                        <IconButton
                            onClick={(event: MouseEvent<HTMLButtonElement>) => {
                                event.preventDefault();
                                setState(state + 1);
                            }}
                        >
                            <RightArrowIcon className="text-3xl text-primary" />
                        </IconButton>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default Steps;
