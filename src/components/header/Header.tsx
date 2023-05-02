import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import LoginButton from "./LoginButton";
import Search from "./Search";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const calculateScrollY = () => {
      console.log(typeof window.scrollY);
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
        backgroundColor: scrollY === 0 ? "transparent" : "white",
      }}
    >
      <div className="Header-top">
        <Link to="/" className="Logo">
          <img src="/images/fetivalLogo.jpeg" alt="logo"></img>
          <span
            className="logo-title"
            style={{
              color: pathname === "/" && scrollY === 0 ? "white" : "#333",
            }}
          >
            축제모아
          </span>
        </Link>
        <Search />
        <LoginButton pathname={pathname} scrollY={scrollY} />
      </div>
      <Navigation pathname={pathname} scrollY={scrollY} />
    </header>
  );
};

export default Header;
