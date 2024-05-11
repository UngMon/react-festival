import { useSelector } from "react-redux";
import { dataActions } from "../../redux/data-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import "./OnGoingSelector.css";

const 행사 = ["진행중", "시작전", "종료"];

const OnGoingSelector = () => {
  const dispatch = useAppDispatch();
  const 행사상태: [boolean, boolean, boolean] = useSelector(
    (state: RootState) => state.data.행사상태
  );

  const clickHandler = (num: number) => {
    if (num === 0 && !행사상태[1] && !행사상태[2]) return;

    if (num === 1 && !행사상태[0] && !행사상태[2]) return;

    if (num === 2 && !행사상태[0] && !행사상태[1]) return;

    dispatch(
      dataActions.행사상태설정([
        num === 0 ? !행사상태[0] : 행사상태[0],
        num === 1 ? !행사상태[1] : 행사상태[1],
        num === 2 ? !행사상태[2] : 행사상태[2],
      ])
    );
  };

  return (
    <ul className="OnGoing-Selector">
      {행사.map((item, index) => (
        <li
          key={index}
          className={`${행사상태[index] && "OnGoing-active"}`}
          onClick={() => clickHandler(index)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default OnGoingSelector;
