import { NavLink } from "react-router-dom";
import { nowDate } from "../../utils/NowDate";
import "./Menu.css";

const Menu = () => {
  const { month } = nowDate();

  const clickCategory = () => {
    window.scrollTo(0, 0);
  };

  return (
    <nav className="pc-nav-bar">
      <ul className="Nav-box">
        <li>
          <NavLink
            to={`/tour?contentTypeId=12&areaCode=0&cat1=all&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            관광지
          </NavLink>
          <div />
        </li>
        <li>
          <NavLink
            to="/culture?contentTypeId=14&areaCode=0&cat1=A02&cat2=all&cat3=all"
            onClick={clickCategory}
          >
            문화시설
          </NavLink>
          <div />
        </li>
        <li>
          <NavLink
            to={`/festival?contentTypeId=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            축제/공연/행사
          </NavLink>
          <div />
        </li>
        <li>
          <NavLink
            to={`/travel?contentTypeId=25&areaCode=0&cat1=C01&cat2=all&cat3=all`}
            onClick={clickCategory}
          >
            여행코스
          </NavLink>
          <div />
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
