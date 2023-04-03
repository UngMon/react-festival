import { useSelector } from "react-redux";
import Card from "../components/Card/Card";
import UiBox from "../components/UI/UiBox";
import { RootState } from "../redux/store";
import "./Result.css";

const ResultPage = () => {
  const searchArray = useSelector(
    (state: RootState) => state.festival.festivalArray
  );

  return (
    <main className="main-box">
      <UiBox category="result" />
      {searchArray.length !== 0 && <Card type="result" month="all" />}
      {searchArray.length === 0 && (
        <div className="result-not-found">
          <p>😅 검색하신 축제가 없습니다!</p>
          <p>다시 검색해주세요!</p>
        </div>
      )}
    </main>
  );
};

export default ResultPage;
