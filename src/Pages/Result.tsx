import { useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import UiBox from "../components/UI/UiBox";

const ResultPage = () => {
  const { keyword } = useParams();

  return (
    <main className="main-box">
      <UiBox category="result" />
      <Card type="result" month="all"/>
    </main>
  );
};

export default ResultPage;
