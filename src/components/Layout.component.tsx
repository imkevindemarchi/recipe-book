import React, { FC, ReactNode, useContext } from "react";
import { useLocation } from "react-router";

// Assets
import wallpaperImg from "../assets/images/login-wallpaper.jpg";

// Components
import Popup from "./Popup.component";
import Loader from "./Loader.component";
import Navbar from "./Navbar.component";
import Sidebar from "./Sidebar.component";
import Hamburger from "./Hamburger.component";

// Contexts
import { SidebarContext, TSidebarContext } from "../providers/sidebar.provider";

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const { pathname } = useLocation();
  const {
    isOpen: isSidebarOpen,
    onStateChange: onSidebarStateChange,
  }: TSidebarContext = useContext(SidebarContext) as TSidebarContext;

  const currentPathSection: string = pathname.split("/")[1];

  const isLoginPage: boolean = currentPathSection === "log-in";
  const isAdminSection: boolean = currentPathSection === "admin";

  const navbar: ReactNode = <Navbar isAdminSection={isAdminSection} />;

  const hamburger: ReactNode = (
    <Hamburger isActive={isSidebarOpen} onClick={onSidebarStateChange} />
  );

  const sidebar: ReactNode = <Sidebar isAdminSection={isAdminSection} />;

  const loader: ReactNode = <Loader />;

  const popup: ReactNode = <Popup />;

  const loginLayout: ReactNode = children;

  const layout: ReactNode = (
    <div
      style={{ backgroundImage: `url("${wallpaperImg}")` }}
      className="min-h-[100vh] bg-cover"
    >
      {navbar}
      {hamburger}
      {sidebar}
      {children}
    </div>
  );

  return (
    <div>
      {isLoginPage ? loginLayout : layout}
      {loader}
      {popup}
    </div>
  );
};

export default Layout;
