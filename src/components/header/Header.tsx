import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import TopButton from "./TopButton";
import HeaderTop from "./HeaderTop";
import MobileNav from "./MobileNav";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const [scrollY, setScrollY] = useState<number>(0);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openNav, setOpenNav] = useState<boolean>(false);

  const mouseEnter = () => {
    if (pathname !== "/") return;
    setMouseOver(true);
  };

  const mouseLeave = () => {
    if (pathname !== "/") return;
    setMouseOver(false);
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const calculateScrollY = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", calculateScrollY);
    return () => {
      window.removeEventListener("scroll", calculateScrollY);
    };
  });

  return (
    <header
      className="Header-box"
      style={{
        backgroundColor:
          pathname === "/" && scrollY === 0 && !mouseOver
            ? "transparent"
            : "white",
        position: pathname.includes("content") ? "relative" : "fixed",
      }}
      onMouseEnter={() => pathname === "/" && mouseEnter()}
      onMouseLeave={() => pathname === "/" && mouseLeave()}
    >
      <HeaderTop
        openNav={openNav}
        setOpenNav={setOpenNav}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
      <Menu
        pathname={pathname}
        scrollY={scrollY}
        mouseOver={mouseOver}
        setOpenSearch={setOpenSearch}
      />
      <TopButton />
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} />
      {openSearch && <Search setOpenSearch={setOpenSearch} />}
    </header>
  );
};

export default Header;
