import { FC } from "react";

// Types
import { IngredientsCarouselI, IngredientT } from "../types";

const IngredientsCarousel: FC<IngredientsCarouselI> = ({
    data,
    isDarkMode,
}) => {
    return (
        <div className="w-full flex flex-row gap-20 overflow-x-scroll pb-10 justify-start items-start">
            {data.map((ingredient: IngredientT) => (
                <div
                    key={ingredient.id}
                    className="flex flex-col gap-5 justify-center items-center"
                >
                    <div className="h-20 w-20 mobile:h-14 mobile:w-14 flex justify-center items-center bg-primary-transparent rounded-lg">
                        <span className="text-[2.5em] mobile:text-3xl">
                            {ingredient.icon}
                        </span>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                        <span
                            className={`font-bold transition-all duration-200 text-center text-sm
                                ${isDarkMode ? "text-white" : "text-black"}
                            `}
                        >
                            {ingredient.name}
                        </span>
                        <span
                            className={`transition-all duration-200
                                ${
                                    isDarkMode
                                        ? "text-gray-300"
                                        : "text-darkgray"
                                }
                            `}
                        >
                            {ingredient.quantity}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IngredientsCarousel;
