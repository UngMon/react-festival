import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./SubMenu.css";

interface T {
  title: string;
}

const 타이틀: Record<string, string> = {
  tour: "관광지",
  culture: "문화시설",
  festival: "축제/공연/행사",
  travel: "여행코스",
  leports: "레포츠",
  lodging: "숙박",
  shopping: "쇼핑",
  restaurant: "음식점",
  search: "검색",
};

const SubMenu = ({ title }: T) => {
  return (
    <nav className="subnav">
      <ul className="submenu">
        <li>
          <Link to="/">
            <span className="material-symbols-outlined sub-home-icon">
              home
            </span>
          </Link>
        </li>
        <li>
          <span className="material-symbols-outlined sub-che-rig">
            chevron_right
          </span>
        </li>
        <li>{타이틀[title]}</li>
      </ul>
    </nav>
  );
};

export default SubMenu;
