import React, { FC, ReactNode } from "react";

// Components
import Popup from "./Popup.component";

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const popup: ReactNode = <Popup />;

  return (
    <div>
      {children}
      {popup}
    </div>
  );
};

export default Layout;
