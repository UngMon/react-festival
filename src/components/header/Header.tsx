import { useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import TopButton from "./TopButton";
import HeaderTop from "./HeaderTop";
import MobileNav from "./MobileNav";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
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

  let fontColor: string = "";
  let backgroundColor: string = "";

  if (window.innerWidth >= 1024) {
    backgroundColor =
      pathname === "/" ? (mouseOver ? "#F5F5F5" : "transparent") : "#F5F5F5";
    fontColor = pathname === "/" ? (mouseOver ? "#333" : "#F5F5F5") : "#333";
  } else {
    backgroundColor = pathname === "/" ? "transparent" : "#F5F5F5";
    fontColor = pathname === "/" ? "#F5F5F5" : "#333";
  }

  return (
    <header
      className="Header-box"
      style={{
        position: pathname === "/" ? "absolute" : "unset",
        backgroundColor: backgroundColor,
        color: fontColor,
      }}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
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
