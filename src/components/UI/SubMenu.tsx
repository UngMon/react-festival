import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./SubMenu.css";

interface T {
  title: string;
}

const object: { [key: string]: string } = {
  tour: "관광지",
  culture: "문화시설",
  festival: "축제/공연/행사",
  travel: "여행코스",
  result: "검색결과",
};

const SubMenu = ({ title }: T) => {
  return (
    <>
      {title !== "trend" && (
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
            <li>{object[title]}</li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default SubMenu;
