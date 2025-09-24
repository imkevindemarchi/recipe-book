import React, { FC, ReactNode } from "react";

// Components
import Popup from "./Popup.component";
import Loader from "./Loader.component";

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const loader: ReactNode = <Loader />;

  const popup: ReactNode = <Popup />;

  return (
    <div>
      {children}
      {loader}
      {popup}
    </div>
  );
};

export default Layout;
