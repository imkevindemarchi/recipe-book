import React, { FC, useContext } from "react";

// Assets
import logoImg from "../assets/images/logo.png";

// Components
import Backdrop from "./Backdrop.component";

// Contexts
import { LoaderContext, TLoaderContext } from "../providers/loader.provider";

const Loader: FC = () => {
  const { state: isLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;

  return isLoading ? (
    <Backdrop>
      <img
        src={logoImg}
        alt="Impossibile visualizzare l'immagine."
        className="w-60 mobile:w-40"
        style={{ animation: "animateLogo  linear 1s infinite alternate" }}
      />
    </Backdrop>
  ) : (
    <></>
  );
};

export default Loader;
