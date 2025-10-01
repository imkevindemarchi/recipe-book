import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

// Assets
import wallpaperImg from "../assets/images/login-wallpaper.jpg";
import wallpaperImg2 from "../assets/images/wallpaper.png";

// Components
import Popup from "./Popup.component";
import Loader from "./Loader.component";
import Navbar from "./Navbar.component";
import Sidebar from "./Sidebar.component";
import Hamburger from "./Hamburger.component";
import Breadcrumb from "./Breadcrumb.component";
import BackToTopButton from "./BackToTopButton.component";
import Footer from "./Footer.component";

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
  const [is404Path, setIs404Path] = useState<boolean>(false);

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

  const breadcrumb: ReactNode = <Breadcrumb />;

  const backToTopButton: ReactNode = <BackToTopButton />;

  const footer: ReactNode = <Footer />;

  const layout: ReactNode = (
    <div
      style={{
        backgroundImage: `url("${
          isAdminSection ? wallpaperImg : wallpaperImg2
        }")`,
      }}
      className="min-h-[100vh] bg-cover"
    >
      {navbar}
      {hamburger}
      {sidebar}
      <div
        className={`px-60 py-10 pb-[50vh] w-full min-h-[100vh] mobile:min-h-[110vh] pt-40 mobile:px-5 mobile:pt-28 flex flex-col gap-5 mobile:pb-[100vh]`}
      >
        {breadcrumb}
        {children}
      </div>
      {!isAdminSection && footer}
    </div>
  );

  useEffect(() => {
    const currentPageTitle: string = document.title.split("-")[1];
    const is404Path: boolean = currentPageTitle?.trim() === "404";
    setIs404Path(is404Path);

    // eslint-disable-next-line
  }, [document.title, pathname]);

  return (
    <div className="w-full h-full relative">
      {isLoginPage ? loginLayout : !is404Path ? layout : children}
      {loader}
      {popup}
      {backToTopButton}
    </div>
  );
};

export default Layout;
