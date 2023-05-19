
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState} from "../redux/store";
import { Item } from "../type/FestivalType";
import UiBox from "../components/ui/UiBox";
import Card from "../components/card/Card";
import Loading from "../components/ui/loading/Loading";
import "./Result.css";

const ResultPage = () => {
  const { keyword } = useParams();
  const festivalState = useSelector((state: RootState) => state.festival);
  const searchArray: Item[] = [];

  if (festivalState.successGetData) {
    for (const item of festivalState.festivalArray) {
      const title = item.title.replace(/\s+/g, "");

      if (title.includes(keyword!)) {
        searchArray.push(item);
      }
    }
  }

  return (
    <main className="main-box">
      <UiBox title="result" />
      {!festivalState.successGetData && <Loading />}
      {searchArray.length !== 0 && (
        <Card title="result" month="all" searchArray={searchArray}/>
      )}
      {searchArray.length === 0 && (
        <div className="result-not-found">
          <p>😅 검색한 축제가 없습니다!</p>
          <p>다시 검색해주세요!</p>
        </div>
      )}
    </main>
  );
};

export default ResultPage;
