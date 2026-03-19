import { Link } from "react-router-dom";
import "./SubMenu.css";

interface T {
  cat1?: string;
}

const 타이틀: Record<string, string> = {
  EX: "체험관광",
  HS: "역사관광",
  NA: "자연관광",
  VE: "문화관광",
  EV: "축제/공연/행사",
  travel: "여행코스",
  LS: "레저스포츠",
  AC: "숙박",
  SH: "쇼핑",
  FD: "음식점",
  C01: "추천코스",
  search: "검색",
};

const SubMenu = ({ cat1 }: T) => {
  if (!cat1 || !타이틀[cat1]) return null;

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
        <li>{타이틀[cat1]}</li>
      </ul>
    </nav>
  );
};

export default SubMenu;
