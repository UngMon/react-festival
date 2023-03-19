import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../Card/Card";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const AllView = () => {
  const { monthKey } = useParams();
  const [month, setMonth] = useState<string>(monthKey || "all");
  const festivalState = useSelector((state: RootState) => state.festival);

  const dispatch = useAppDispatch();
  const festivalArray = sessionStorage.getItem('festivalArray') || '';

  useEffect(() => {
    //새로고침(마운트)시 리덕스 스테이트 업데이트
    dispatch(festivalActions.sortDataByMonth(JSON.parse(festivalArray)))
  }, [dispatch, festivalArray])

  return (
    <main className="main-box">
      <UiBox category={"all"} month={month} setMonth={setMonth} />
      {!festivalState.sortedMonth && <Loading />}
      {festivalState.sortedMonth && <Card type="all" month={month} />}
    </main>
  );
};

export default AllView;
