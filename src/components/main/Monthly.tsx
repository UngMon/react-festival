import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import GetDataError from "../error/GetDataError";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const Monthly = () => {
  const { monthKey } = useParams();
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  // 현재 url의 pathname값을 기준으로 화면에 렌더링
  const [month, setMonth] = useState<string>(monthKey!);
  console.log(month)
  useEffect(() => {
    if (festivalState.successGetData && !festivalState.sortedMonth) {
      dispatch(festivalActions.sortDataByMonth());
    }
  }, [dispatch, festivalState]);

  return (
    <main className="main-box">
      {festivalState.successGetData && (
        <UiBox category={"monthly"} month={month} setMonth={setMonth} />
      )}
      {festivalState.loading ? (
        <Loading />
      ) : (
        !festivalState.successGetData && <GetDataError />
      )}
      {festivalState.sortedMonth && <Card type="monthly" month={month} />}
    </main>
  );
};

export default Monthly;
