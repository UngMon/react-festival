import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import LoginButton from "./LoginButton";
import PcSearch from "./PcSearch";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState<number>(0);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

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
        position: pathname.includes('content') ? 'relative' : 'fixed'
      }}
      ref={headerRef}
      onMouseEnter={() => pathname === "/" && mouseEnter()}
      onMouseLeave={() => pathname === "/" && mouseLeave()}
    >
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
          <PcSearch
            pathname={pathname}
            scrollY={scrollY}
            mouseOver={mouseOver}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
          />
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
    </header>
  );
};

export default Header;
