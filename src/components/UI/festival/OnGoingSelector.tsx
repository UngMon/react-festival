import "./OnGoingSelector.css";

interface OnGoingProps {
  행사상태: [boolean, boolean, boolean];
  행사상태설정: React.Dispatch<
    React.SetStateAction<[boolean, boolean, boolean]>
  >;
}

const OnGoingSelector = ({ 행사상태, 행사상태설정 }: OnGoingProps) => {
  const clickHandler = (num: number) => {
    if (num === 0) {
      if (!행사상태[1] && !행사상태[2]) return;
      행사상태설정([!행사상태[0], 행사상태[1], 행사상태[2]]);
    }

    if (num === 1) {
 
      if (!행사상태[0] && !행사상태[2]) return;
      console.log(행사상태)
      행사상태설정([행사상태[0], !행사상태[1], 행사상태[2]]);
    }

    if (num === 2) {
      console.log(행사상태)
      if (!행사상태[0] && !행사상태[1]) return;
      console.log(행사상태)
      행사상태설정([행사상태[0], 행사상태[1], !행사상태[2]]);
    }
  };
  console.log(행사상태)
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
