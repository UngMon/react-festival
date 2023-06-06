
import "./Nav.css";

interface T {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const Nav = ({ openNav, setOpenNav, openSearch, setOpenSearch }: T) => {
  const click = () => {
    if (openSearch) return;
    
    setOpenNav(!openNav);
    openSearch && setOpenSearch(false);
  };
  return (
    <div id="Nav" onClick={() => click()}>
      <div className={`bar ${openNav ? "ro-m45" : "ro-m45n"}`}></div>
      <div className={`bar ${openNav ? "fadeout" : "notfadeout"}`}></div>
      <div className={`bar ${openNav ? "ro-45" : "ro-45n"}`}></div>
    </div>
  );
};

export default Nav;
