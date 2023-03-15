import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CurrentSeason } from "../../modules/CurrentSeason";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import classes from "./Navigation.module.css";

const Navigation = () => {
  const dispatch = useAppDispatch();
  const boolean = useSelector((state: RootState) => state.festival);

  const clickCategory = (value?: string) => {
    if (!boolean.successGetData) {
      return;
    }

    if (!boolean.sortedMonth) {
      dispatch(festivalActions.sortDataByMonth());
    }

    if (value! === "region" && !boolean.sortedRegion) {
      dispatch(festivalActions.sortDataByRegion());
    }

    if (value! === "season" && !boolean.sortedSeason) {
      dispatch(festivalActions.sortDataBySeason());
    }
  };

  return (
    <nav>
      <ul className={classes["Nav-box"]}>
        <NavLink to="/all-festival" onClick={() => clickCategory()}>
          전체 보기
        </NavLink>
        <NavLink to="/regions" onClick={() => clickCategory("region")}>
          지역별
        </NavLink>
        <NavLink
          to={`/seasons/${CurrentSeason()}`}
          onClick={() => clickCategory("season")}
        >
          계절별
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navigation;
