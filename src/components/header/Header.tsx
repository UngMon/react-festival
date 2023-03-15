import Logo from "./Logo";
import Navigation from "./Navigation";
import "./Header.css";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <header className="Header-box">
      <Logo />
      <Navigation />
      <LoginButton />
    </header>
  );
};

export default Header;
