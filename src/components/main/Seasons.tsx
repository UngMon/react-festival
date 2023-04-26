import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { CurrentSeason } from "../../utils/CurrentSeason";
import UiBox from "../UI/UiBox";
import Card from "../card/Card";
import Loading from "../UI/Loading";
import GetDataError from "../error/GetDataError";

const Seasons = () => {
  const dispatch = useAppDispatch();
  const { seasonKey } = useParams();
  const [season, setSeason] = useState<string>(seasonKey || CurrentSeason());
  const festivalState = useSelector((state: RootState) => state.festival);

  useEffect(() => {
    //새로고침(마운트)시 리덕스 스테이트 업데이트
    if (festivalState.successGetData && !festivalState.sortedSeason) {
      dispatch(festivalActions.sortDataBySeason());
    }
  }, [dispatch, festivalState]);

  return (
    <main className="main-box">
      {festivalState.successGetData && (
        <UiBox category={"season"} season={season} setSeason={setSeason} />
      )}
      {festivalState.loading ? (
        <Loading />
      ) : (
        !festivalState.successGetData && <GetDataError />
      )}
      {festivalState.sortedSeason && (
        <Card type="season" season={season} month="all" />
      )}
    </main>
  );
};

export default Seasons;
