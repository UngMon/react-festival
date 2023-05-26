import { useSelector } from "react-redux";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import "./OnGoingSelector.css";

const OnGoingSelector = () => {
  const dispatch = useAppDispatch();
  const 행사상태 = useSelector((state: RootState) => state.festival.행사상태);

  const clickHandler = (num: number) => {
    if (num === 0) {
      if (!행사상태[1] && !행사상태[2]) return;
      dispatch(
        festivalActions.행사상태설정([!행사상태[0], 행사상태[1], 행사상태[2]])
      );
    }

    if (num === 1) {
      if (!행사상태[0] && !행사상태[2]) return;
      dispatch(
        festivalActions.행사상태설정([행사상태[0], !행사상태[1], 행사상태[2]])
      );
    }

    if (num === 2) {
      if (!행사상태[0] && !행사상태[1]) return;
      dispatch(
        festivalActions.행사상태설정([행사상태[0], 행사상태[1], !행사상태[2]])
      );
    }
  };
  console.log(행사상태);
  return (
    <ul className="OnGoing-Selector">
      <li
        className={행사상태[0] ? "OnGoing-active" : "null1"}
        onClick={() => clickHandler(0)}
      >
        진행중
      </li>
      <li
        className={행사상태[1] ? "OnGoing-active" : "null1"}
        onClick={() => clickHandler(1)}
      >
        시작전
      </li>
      <li
        className={`${행사상태[2] && "OnGoing-active"}`}
        onClick={() => clickHandler(2)}
      >
        종료
      </li>
    </ul>
  );
};

export default OnGoingSelector;
