import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import GetDataError from "../error/GetDataError";
import Loading from "../UI/Loading";
import UiBox from "../UI/UiBox";

const AllView = () => {
  const { monthKey } = useParams();
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  const [month, setMonth] = useState<string>(monthKey || "all");

  useEffect(() => {
    if (festivalState.successGetData && !festivalState.sortedMonth) {
      dispatch(festivalActions.sortDataByMonth());
    }
  }, [dispatch, festivalState]);

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
