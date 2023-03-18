import Card from "../components/Card/Card";
import UiBox from "../components/UI/UiBox";

const ResultPage = () => {

  return (
    <main className="main-box">
      <UiBox category="result" />
      <Card type="result" month="all"/>
    </main>
  );
};

export default ResultPage;
