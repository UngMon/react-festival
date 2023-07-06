import Card from "../components/card/Card";
import "./Result.css";

const ResultPage = () => {

  return (
    <main className="main-box">
      <Card title="result" />
      {/* {tcts.serchRecord[0] === "fulfiled" && tcts.result['0'].length === 0 && (
        <div className="result-not-found">
          <p>😅 검색한 축제가 없습니다!</p>
          <p>다시 검색해주세요!</p>
        </div>
      )} */}
    </main>
  );
};

export default ResultPage;
