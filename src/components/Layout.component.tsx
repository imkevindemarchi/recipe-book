import React, { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
