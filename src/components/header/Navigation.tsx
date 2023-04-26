import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CurrentSeason } from "../../utils/CurrentSeason";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import classes from "./Navigation.module.css";

const Navigation = () => {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);

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
        <nav>
          <ul className={classes["mobile-Nav-box"]}>
            <li>
              <NavLink
                to="month/all"
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
        <nav>
          <ul className={classes["Nav-box"]}>
            <li>
              <NavLink
                to="month/all"
                onClick={() => clickCategory("month")}
                style={({ isActive }) => {
                  return { color: isActive ? "orange" : "black" };
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
                  return { color: isActive ? "orange" : "black" };
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
                  return { color: isActive ? "orange" : "black" };
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
