import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CurrentSeason } from "../../utils/CurrentSeason";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import "./Navigation.css";

interface HeaderProps {
  pathname: string;
  scrollY: number;
}

const Navigation = ({ pathname, scrollY }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  const thisMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const clickCategory = (value?: string) => {
    if (!festivalState.successGetData) {
      if (festivalState.festivalArray.length === 0) {
        return;
      }
    }

    if (value === "month" && !festivalState.sortedMonth) {
      dispatch(festivalActions.sortDataByMonth());
    }

    if (value === "region" && !festivalState.sortedRegion) {
      dispatch(festivalActions.sortDataByRegion());
    }

    if (value === "season" && !festivalState.sortedSeason) {
      dispatch(festivalActions.sortDataBySeason());
    }
  };

  return (
    <>
      {
        // mobile용
        <nav className="mobile-nav-bar">
          <ul className="mobile-Nav-box">
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
                <img src="/images/month.png" alt="월" />
                <span>월별 보기</span>
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
                <img src="/images/location.png" alt="지역" />
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
                <img src="/images/season.png" alt="계절" />
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
                <img src="/images/loupe.png" alt="검색" />
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
            pathname === "/" && scrollY === 0 && "no-border"
          }`}
        >
          <ul className="Nav-box">
            <li>
              <NavLink
                to={`/month/${thisMonth}`}
                onClick={() => clickCategory("month")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0
                      ? "white"
                      : "#333",
                  };
                }}
              >
                월별 보기
              </NavLink>
            </li>
            <li>
              <NavLink
                to="regions/0"
                onClick={() => clickCategory("region")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0
                      ? "white"
                      : "#333",
                  };
                }}
              >
                지역별
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`seasons/${CurrentSeason()}`}
                onClick={() => clickCategory("season")}
                style={({ isActive }) => {
                  return {
                    color: isActive
                      ? "orange"
                      : pathname === "/" && scrollY === 0
                      ? "white"
                      : "#333",
                  };
                }}
              >
                계절별
              </NavLink>
            </li>
          </ul>
        </nav>
      }
    </>
  );
};

export default Navigation;
