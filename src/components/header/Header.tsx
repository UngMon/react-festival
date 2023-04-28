import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import "./Header.css";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <header className="Header-box">
      <Link to="/month/all" className="Logo">
        <img src="/images/fetivalLogo.png" alt="logo"></img>
        <span className="logo-title">축제모아</span>
      </Link>
      <Navigation />
      <LoginButton />
    </header>
  );
};

export default Header;
