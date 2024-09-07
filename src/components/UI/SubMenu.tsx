import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./SubMenu.css";

interface T {
  title: string;
}

const SubMenu = ({ title }: T) => {
  return (
    <nav className="subnav">
      <ul className="submenu">
        <li>
          <Link to="/">
            <img src="/images/home.png" alt="홈" width="25" />
          </Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faChevronRight} />
        </li>
        <li>{title}</li>
      </ul>
    </nav>
  );
};

export default SubMenu;
