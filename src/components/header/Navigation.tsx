import { NavLink } from "react-router-dom";
import { CurrentSeason } from "../../utils/CurrentSeason";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faLocationDot,
  faWind,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";
import { useAppDispatch } from "../../redux/store";
import { categoryActions } from "../../redux/category-slice";

interface T {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  setOpenSearch: (value: boolean) => void;
}

const Navigation = ({ pathname, scrollY, mouseOver, setOpenSearch }: T) => {
  const dispatch = useAppDispatch();
  const thisMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const clickCategory = (value?: string) => {
    window.scrollTo(0, 0);
    if (value !== "festival") dispatch(categoryActions.clearSet());
    setOpenSearch(false);
  };

  return (
    <>
      {
        // mobile용
        <nav className="mobile-nav-bar">
          <ul className="mobile-nav-box">
            <li>
              <NavLink
                className={`${
                  pathname === "/" && scrollY === 0 && "no-border"
                }`}
                to={`month/${thisMonth}`}
                onClick={() => clickCategory("month")}
                style={({ isActive }) => {
                  return { color: isActive ? "orange" : "black" };
                }}
              >
                <FontAwesomeIcon icon={faCalendar} />
                <span>월별</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="regions/0"
                onClick={() => clickCategory("region")}
                style={({ isActive }) => {
                  return { color: isActive ? "orange" : "black" };
                }}
              >
                <FontAwesomeIcon icon={faLocationDot} />
                <span>지역별</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`seasons/${CurrentSeason()}`}
                onClick={() => clickCategory("season")}
                style={({ isActive }) => {
                  return { color: isActive ? "orange" : "black" };
                }}
              >
                <FontAwesomeIcon icon={faWind} />
                <span>계절별</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"search"}
                style={({ isActive }) => {
                  return { color: isActive ? "orange" : "black" };
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>검색</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      }
      {
        //pc
        <nav
          className={`pc-nav-bar ${
            pathname === "/" && scrollY === 0 && !mouseOver && "no-border"
          }`}
        >
          <ul className="Nav-box">
            <li>
              <NavLink
                to={`/tour/search?region=1&cat1=all&cat2=all&cat3=all`}
                onClick={() => clickCategory("tour")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0 && !mouseOver
                      ? "white"
                      : "#333",
                  };
                }}
              >
                관광지
              </NavLink>
            </li>
            <li>
              <NavLink
                to="culture/search?region=1&cat1=all&cat2=all&cat3=all"
                onClick={() => clickCategory("culture")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0 && !mouseOver
                      ? "white"
                      : "#333",
                  };
                }}
              >
                문화시설
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/festival/search?month=${thisMonth}&region=0`}
                onClick={() => clickCategory("festival")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0 && !mouseOver
                      ? "white"
                      : "#333",
                  };
                }}
              >
                지역축제
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/travel/search?region=1&cat1=all&cat2=all&cat3=all`}
                onClick={() => clickCategory("travel")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0 && !mouseOver
                      ? "white"
                      : "#333",
                  };
                }}
              >
                여행코스
              </NavLink>
            </li>
          </ul>
        </nav>
      }
    </>
  );
};

export default Navigation;
