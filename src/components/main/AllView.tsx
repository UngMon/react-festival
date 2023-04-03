import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../Card/Card";
import GetDataError from "../Error/GetDataError";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const AllView = () => {
  console.log("allview");
  const { monthKey } = useParams();
  const dispatch = useAppDispatch();

  const festivalState = useSelector((state: RootState) => state.festival);
  const [month, setMonth] = useState<string>(monthKey || "all");

  useEffect(() => {
    const arrayExist = sessionStorage.getItem("festivalArray");
    let festivalArray: string = '';

    if (festivalState.successGetData && !arrayExist) {
      // 관광공사 데이터는 얻어왔지만 세션스토리지에 정보가 없을 때
      sessionStorage.setItem(
        "festivalArray",
        JSON.stringify(festivalState.festivalArray)
      );
    }

    if (!festivalState.successGetData && !arrayExist) {
      // 양쪽데이터가 없으면 app.tsx에서 thunkAction에서 데이터를 불러오기 까지 기다린다.
      return;
    }

    festivalArray = sessionStorage.getItem("festivalArray")!;
    if (!festivalState.sortedMonth) {
      console.log('여기 작동함?')
      dispatch(festivalActions.sortDataByMonth(JSON.parse(festivalArray)));
    }
  }, [dispatch, festivalState]);

  console.log(month)
  return (
    <main className="main-box">
      <UiBox category={"all"} month={month} setMonth={setMonth} />
      {festivalState.loading && <Loading />}
      {!festivalState.loading && !festivalState.successGetData && (
        <GetDataError />
      )}
      {festivalState.sortedMonth && <Card type="all" month={month} />}
    </main>
  );
};

export default AllView;
