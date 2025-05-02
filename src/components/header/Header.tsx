import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "./PcMenu";
import Search from "./Search";
import TopButton from "./TopButton";
import LoginButton from "./LoginButton";
import MobileNav from "./MobileMenu";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const headRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    if (pathname !== "/" && !headRef.current) return;

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
      className={`header-container ${pathname !== "/" ? "h-o" : ""}`}
    >
      <div className="header-box">
        <Link to="/" className="Logo">
          <div>이곳저곳</div>
        </Link>
        <Menu />
        <div className="header-sub-box">
          <Search />
          <LoginButton />
          <MobileNav headRef={headRef}/>
        </div>
        <TopButton />
      </div>
    </header>
  );
};

export default Header;
