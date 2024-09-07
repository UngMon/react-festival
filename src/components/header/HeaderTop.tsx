import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LoginButton from "./LoginButton";
import "./HeaderTop.css";

interface T {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
  setMouseOver: (value: boolean) => void;
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const HeaderTop = ({
  openNav,
  setOpenNav,
  setMouseOver,
  openSearch,
  setOpenSearch,
}: T) => {
  const clickHandler = () => {
    if (openSearch) return;
    setOpenNav(!openNav);
    openSearch && setOpenSearch(false);
  };

  const saerchClickHandler = () => {
    setOpenSearch(!openSearch);
    setMouseOver(false);
  };

  return (
    <div className="Header-top">
      <Link to="/" className="Logo" onClick={() => setOpenSearch(false)}>
        <span className="logo-title">여기저기</span>
      </Link>
      <div className="page-top-interaction">
        <button
          className="magnifying"
          onClick={saerchClickHandler}
          style={{ color: openNav ? "black" : "inherit" }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button id="nav-bar" onClick={clickHandler}>
          <div
            className={`bar ${openNav ? "ro-t45" : ""}`}
            style={{ borderColor: openNav ? "black" : "inherit" }}
          />
          <div
            className={`bar ${openNav ? "fadeout" : ""}`}
            style={{ borderColor: openNav ? "black" : "inherit" }}
          />
          <div
            className={`bar ${openNav ? "ro-b45" : ""}`}
            style={{ borderColor: openNav ? "black" : "inherit" }}
          />
        </button>
        <LoginButton />
      </div>
    </div>
  );
};

export default HeaderTop;
