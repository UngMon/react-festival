import { NavLink } from "react-router-dom";
import { nowDate } from "../../utils/NowDate";
import "./Menu.css";

interface T {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  setOpenSearch: (value: boolean) => void;
}

const Menu = ({ pathname, scrollY, mouseOver, setOpenSearch }: T) => {
  const { month } = nowDate();

  const clickCategory = () => {
    window.scrollTo(0, 0);
    setOpenSearch(false);
  };

  return (
    <>
      <nav
        className={`pc-nav-bar ${
          pathname === "/" && scrollY === 0 && !mouseOver && "no-border"
        }`}
      >
        <ul className="Nav-box">
          <li>
            <NavLink
              to={`/tour?type=12&areaCode=1&cat1=all&cat2=all&cat3=all`}
              onClick={clickCategory}
              style={({ isActive }) => {
                return {
                  color: "#333",
                  // color: isActive
                  //   ? "orange"
                  //   : pathname === "/" && scrollY === 0 && !mouseOver
                  //   ? "white"
                  //   : "#333",
                };
              }}
            >
              관광지
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/culture?type=14&areaCode=1&cat1=A02&cat2=all&cat3=all"
              onClick={clickCategory}
              style={({ isActive }) => {
                return {
                  color: "#333",
                  // color: isActive
                  //   ? "orange"
                  //   : pathname === "/" && scrollY === 0 && !mouseOver
                  //   ? "white"
                  //   : "#333",
                };
              }}
            >
              문화시설
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/festival?type=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
              onClick={clickCategory}
              style={({ isActive }) => {
                return {
                  color: "#333",
                  // color: isActive
                  //   ? "orange"
                  //   : pathname === "/" && scrollY === 0 && !mouseOver
                  //   ? "white"
                  //   : "#333",
                };
              }}
            >
              축제/공연/행사
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/travel?type=25&areaCode=1&cat1=C01&cat2=all&cat3=all`}
              onClick={clickCategory}
              style={({ isActive }) => {
                return {
                  color: "#333",
                  // color: isActive
                  //   ? "orange"
                  //   : pathname === "/" && scrollY === 0 && !mouseOver
                  //   ? "white"
                  //   : "#333",
                };
              }}
            >
              여행코스
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Menu;
