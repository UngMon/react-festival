import { Link } from "react-router-dom";
import "./Logo.css";

interface T {
  type: string;
}

const Logo = ({ type }: T) => {
  return (
    <h2 className={`webname ${type === "login-error" && "login-error"}`}>
      <Link to="/" className="logo">
        <span>이</span>
        <span>곳</span>
        <span>저</span>
        <span>곳</span>
      </Link>
    </h2>
  );
};

export default Logo;
