import { FC, MouseEvent } from "react";

// Types
import { HamburgerI } from "../types";

const Hamburger: FC<HamburgerI> = ({ isActive, isDarkMode, onClick }) => {
    const lines: number[] = [1, 2, 3];

    function clickHandler(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        onClick();
    }

    return (
        <button
            onClick={clickHandler}
            className="hidden mobile:flex flex-col top-7 left-7 justify-around w-10 h-10 fixed z-[980]"
        >
            {lines.map((line) => (
                <div
                    key={line}
                    style={{ transformOrigin: "1px" }}
                    className={`w-10 h-1 relative rounded-sm first:rotate-0 even:opacity-1 even:translate-x-0 last:rotate-0 transition-all duration-200
                        ${!isActive && (isDarkMode ? "bg-white" : "bg-black")}
                        ${
                            isActive &&
                            "bg-primary first:rotate-45 even:opacity-0 even:translate-x-20 last:rotate-[-45deg]"
                        }
                    `}
                ></div>
            ))}
        </button>
    );
};

export default Hamburger;
