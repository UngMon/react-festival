import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import "./Header.css";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <header className="Header-box">
      <Link to="/" className="Logo">
        축제모아
      </Link>
      <Navigation />
      <LoginButton />
    </header>
  );
};

export default Header;
