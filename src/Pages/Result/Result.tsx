import { CheckParams } from "hooks/useCheckParams";
import { Navigate } from "react-router-dom";
import { TitleType } from "type/FetchType";
import Input from "./Input";
import ResultCard from "./ResultCard";
import "./Result.css";

interface T {
  title: TitleType;
  params: CheckParams;
  page: number;
}

const Result = ({ title, params, page }: T) => {
  if (params.requireRedirect !== "") return <Navigate to="/" />;

  return (
    <section className="Result-Container">
      <Input params={params} />
      <ResultCard params={params} title={title} page={page} />
    </section>
  );
};

export default Result;
