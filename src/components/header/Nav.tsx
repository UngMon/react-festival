import { useState } from "react";
import Side from "./Side";
import "./Nav.css";

const Nav = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const click = () => {
    console.log('??????')
    setOpenNav(!openNav);
  };
  return (
    <div id="Nav" onClick={() => click()}>
      <div className={`bar ${openNav ? "ro-m45" : "ro-m45n"}`}></div>
      <div className={`bar ${openNav ? "fadeout" : "notfadeout"}`}></div>
      <div className={`bar ${openNav ? "ro-45" : "ro-45n"}`}></div>
      {openNav && <Side setOpenNav={setOpenNav} />}
    </div>
  );
};

export default Nav;
