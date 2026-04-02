import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./logo/Logo";
import PcMenu from "./navigation/PcMenu";
import SearchButton from "./search/SearchButton";
import LoginButton from "./login/LoginButton";
import MobileMenu from "./navigation/MobileMenu";
import "./HeaderContainer.css";

const HeaderContainer = () => {
  const { pathname } = useLocation();
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const headRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    if (pathname !== "/" || !headRef.current) return;

    const scrollHandler = () => {
      const element = headRef.current!;

      if (window.scrollY > 0) {
        if (!element.classList.contains("scroll-down"))
          element.classList.add("scroll-down");
      } else element.classList.remove("scroll-down");
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [pathname]);

  return (
    <header
      ref={headRef}
      className={`header-container ${pathname !== "/" ? "h-o" : ""} ${
        openSearch ? "search-on" : ""
      }`}
    >
      <div className="header-box">
        <Logo type="start" />
        <PcMenu />
        <div className="header-sub-box">
          <SearchButton openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <LoginButton />
          <MobileMenu headRef={headRef} />
        </div>
      </div>
    </header>
  );
};

export default HeaderContainer;
