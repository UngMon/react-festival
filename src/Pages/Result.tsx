import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { festivalActions } from "../redux/festival-slice";
import { RootState, useAppDispatch } from "../redux/store";
import { Item } from "../modules/Type";
import UiBox from "../components/UI/UiBox";
import Card from "../components/Card/Card";
import "./Result.css";
import Loading from "../components/UI/Loading";

const ResultPage = () => {
  const { keyword } = useParams();
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);

  useEffect(() => {
    const searchArray: Item[] = [];
    if (!festivalState.isSearched && festivalState.successGetData) {
      for (const item of festivalState.festivalArray) {
        const title = item.title.replace(/\s+/g, "");

        if (title.includes(keyword!)) {
          searchArray.push(item);
        }
      }
      dispatch(festivalActions.searchFestival(searchArray));
    }
  }, [dispatch, festivalState, keyword]);

  return (
    <main className="main-box">
      <UiBox category="result" />
      {!festivalState.successGetData && <Loading />}
      {festivalState.isSearched && festivalState.searchArray.length !== 0 && (
        <Card type="result" month="all" />
      )}
      {festivalState.isSearched && festivalState.searchArray.length === 0 && (
        <div className="result-not-found">
          <p>😅 검색하신 축제가 없습니다!</p>
          <p>다시 검색해주세요!</p>
        </div>
      )}
    </main>
  );
};

export default ResultPage;
