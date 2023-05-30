import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Navigation from "./Navigation";
import Search from "./Search";
import Top from "./Top";
import Nav from "./Nav";
import Side from "./Side";
import LoginButton from "./LoginButton";
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

  const clickSearch = () => {
    !openSearch && setOpenSearch(true);
    openNav && setOpenNav(false);
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
            : "rgba(245,245,245)",
        position: pathname.includes("content") ? "relative" : "fixed",
      }}
      onMouseEnter={() => pathname === "/" && mouseEnter()}
      onMouseLeave={() => pathname === "/" && mouseLeave()}
    >
      {openSearch && (
        <Search
          pathname={pathname}
          scrollY={scrollY}
          mouseOver={mouseOver}
          setOpenSearch={setOpenSearch}
        />
      )}
      <div className="Header-top">
        <Link to="/" className="Logo" onClick={() => setOpenSearch(false)}>
          <img src="/images/fetivalLogo.jpeg" alt="logo"></img>
          <span
            className="logo-title"
            style={{
              color:
                pathname === "/" && scrollY === 0 && !mouseOver
                  ? "white"
                  : "#333",
            }}
          >
            축제모아
          </span>
        </Link>
        <div className="page-top-interaction">
          <button
            className={`magnifying ${
              pathname === "/" && scrollY === 0 && !mouseOver
                ? "scroll-top-color"
                : "#normal-color"
            }`}
            onClick={clickSearch}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <Nav
            openNav={openNav}
            setOpenNav={setOpenNav}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
          />
          {openNav && <Side setOpenNav={setOpenNav} />}
          <LoginButton
            pathname={pathname}
            scrollY={scrollY}
            mouseOver={mouseOver}
            setOpenSearch={setOpenSearch}
          />
        </div>
      </div>
      <Navigation
        pathname={pathname}
        scrollY={scrollY}
        mouseOver={mouseOver}
        setOpenSearch={setOpenSearch}
      />
      <Top />
    </header>
  );
};

export default Header;
