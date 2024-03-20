import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LoginButton from "./LoginButton";
import "./HeaderTop.css";

interface T {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const HeaderTop = ({ openNav, setOpenNav, openSearch, setOpenSearch }: T) => {
  const clickHandler = () => {
    if (openSearch) return;
    setOpenNav(!openNav);
    openSearch && setOpenSearch(false);
  };

  const saerchClickHandler = () => {
    setOpenSearch(!openSearch);
  };

  return (
    <div className="Header-top">
      <Link to="/" className="Logo" onClick={() => setOpenSearch(false)}>
        <span className="logo-title">여기저기</span>
      </Link>
      <div className="page-top-interaction">
        <button className="magnifying" onClick={saerchClickHandler}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <div id="Nav" onClick={clickHandler}>
          <div className={`bar ${openNav ? "ro-m45" : "ro-m45n"}`}></div>
          <div className={`bar ${openNav ? "fadeout" : "notfadeout"}`}></div>
          <div className={`bar ${openNav ? "ro-45" : "ro-45n"}`}></div>
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default HeaderTop;
