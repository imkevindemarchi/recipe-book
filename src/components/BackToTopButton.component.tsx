import React, { FC, useState } from "react";

// Assets
import { ArrowUpIcon } from "../assets/icons";

// Components
import LiquidGlass from "./LiquidGlass.component";

const BackToTopButton: FC = () => {
  const [state, setState] = useState(false);

  function checkScroll() {
    if (!state && window.pageYOffset > 20) setState(true);
    else if (state && window.pageYOffset <= 20) setState(false);
  }

  window.addEventListener("scroll", checkScroll);

  return (
    <LiquidGlass
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        zIndex: state ? 900 : -900,
      }}
      className="p-3 fixed bottom-7 right-7 cursor-pointer hover:opacity-50"
    >
      <ArrowUpIcon className="text-white text-3xl" />
    </LiquidGlass>
  );
};

export default BackToTopButton;
