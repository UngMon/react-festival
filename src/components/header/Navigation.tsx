import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CurrentSeason } from "../../modules/CurrentSeason";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import classes from "./Navigation.module.css";

const Navigation = () => {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);

  const clickCategory = (value?: string) => {
    if (!festivalState.successGetData) {
      if (festivalState.festivalArray.length === 0) {
        return alert("데이터를 불러오지 못 했습니다. 새로고침 해주세요!");
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
    <nav>
      <ul className={classes["Nav-box"]}>
        <NavLink
          to="all-festival/month/all"
          onClick={() => clickCategory("month")}
          style={({ isActive }) => {
            return { color: isActive ? "orange" : "black" };
          }}
        >
          전체 보기
        </NavLink>
        <NavLink
          to="regions/areacode/0"
          onClick={() => clickCategory("region")}
          style={({ isActive }) => {
            return { color: isActive ? "orange" : "black" };
          }}
        >
          지역별
        </NavLink>
        <NavLink
          to={`seasons/${CurrentSeason()}`}
          onClick={() => clickCategory("season")}
          style={({ isActive }) => {
            return { color: isActive ? "orange" : "black" };
          }}
        >
          계절별
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navigation;
