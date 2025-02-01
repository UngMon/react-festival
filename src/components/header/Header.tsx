import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import TopButton from "./TopButton";
import HeaderTop from "./HeaderTop";
import MobileNav from "./MobileNav";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openNav, setOpenNav] = useState<boolean>(false);
  const headRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    if (pathname !== "/" && !headRef.current) return;

    const scrollHandler = () => {
      if (window.scrollY === 0) {
        console.log(pathname);
        headRef.current!.style.position = "absolute";
        headRef.current!.style.background = "none";
        headRef.current!.style.color = "#F5F5F5";
        return;
      }

      headRef.current!.style.position = "fixed";
      headRef.current!.style.background = "#F5F5F5";
      headRef.current!.style.color = "#333";
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [pathname]);

  return (
    <header
      ref={headRef}
      className={`Header-box ${pathname !== "/" ? "h-o" : ""}`}
    >
      <HeaderTop
        openNav={openNav}
        setOpenNav={setOpenNav}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
      <Menu />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} />
      {openSearch && <Search setOpenSearch={setOpenSearch} />}
      <TopButton />
    </header>
  );
};

export default Header;
