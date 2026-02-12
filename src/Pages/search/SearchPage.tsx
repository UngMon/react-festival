import { CheckParams } from "hooks/useCheckParams";
import { Navigate } from "react-router-dom";
import { TourDataType } from "types/FetchType";
import Input from "../../features/search/Input";
import ResultCard from "../../features/search/SearchCard";
import "./SearchPage.css";

interface T {
  tourDataType: TourDataType;
  params: CheckParams;
  page: number;
  setPage: (value: number) => void;
}

const SearchPage = ({ tourDataType, params, page, setPage }: T) => {
  if (params.requireRedirect !== "") return <Navigate to="/" />;

  return (
    <section className="Result-Container">
      <Input params={params} setPage={setPage} />
      <ResultCard params={params} tourDataType={tourDataType} page={page} />
    </section>
  );
};

export default SearchPage;
