import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MENU_ITEMS } from "./constants";
import "./PcMenu.css";

const PcMenu = () => {
  const [openNav, setOpenNav] = useState<boolean>(true);

  const clickCategory = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!openNav) return;

    const resizeHandler = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [openNav, setOpenNav]);

  return (
    <nav className="nav-container">
      <ul className="nav-box">
        {MENU_ITEMS.map((item) => (
          <li onClick={clickCategory} key={item.text}>
            <NavLink to={item.to}>{item.text}</NavLink>
            <i />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PcMenu;
