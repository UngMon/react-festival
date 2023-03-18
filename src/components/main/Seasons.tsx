import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { festivalActions } from "../../redux/festival-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { CurrentSeason } from "../../modules/CurrentSeason";
import UiBox from "../UI/UiBox";
import Card from "../Card/Card";
import Loading from "../UI/Loading";

const Seasons = () => {
  const { seasonKey } = useParams();
  const [season, setSeason] = useState<string>(seasonKey || CurrentSeason());
  const festivalState = useSelector((state: RootState) => state.festival);

  const dispatch = useAppDispatch();
  const festivalArray = sessionStorage.getItem('festivalArray') || '';

  useEffect(() => {
    //새로고침(마운트)시 리덕스 스테이트 업데이트
    dispatch(festivalActions.sortDataBySeason(JSON.parse(festivalArray)))
  }, [dispatch, festivalArray])

  return (
    <main className="main-box">
      <UiBox category={"season"} season={season} setSeason={setSeason} />
      {!festivalState.sortedSeason && <Loading />}
      {festivalState.sortedSeason && (
        <Card type="season" season={season} month="all" />
      )}
    </main>
  );
};

export default Seasons;
