import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import UiBox from "../ui/UiBox";
import Loading from "../ui/Loading";

const Monthly = () => {
  const { monthKey } = useParams();
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  // 현재 url의 pathname값을 기준으로 화면에 렌더링
  const [month, setMonth] = useState<string>(monthKey!);
  const [areaCode, setAreaCode] = useState<string>("0");

  useEffect(() => {
    if (festivalState.successGetData && !festivalState.sortedFestivalArr) {
      dispatch(festivalActions.sortFestivalArray());
    }
  }, [dispatch, festivalState]);

  return (
    <main className="main-box">
      {festivalState.successGetData && (
        <UiBox category={"festival"} month={month} setMonth={setMonth} />
      )}
      {!festivalState.sortedFestivalArr ? (
        <Loading />
      ) : (
        <Card type="festival" month={month} />
      )}
    </main>
  );
};

export default Monthly;
