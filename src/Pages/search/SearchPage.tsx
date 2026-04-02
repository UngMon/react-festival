import { useCheckParams } from "hooks/useCheckParams";
import { Navigate } from "react-router-dom";
import Input from "../../features/search/Input";
import ResultCard from "../../features/search/SearchCard";
import PageButton from "features/selector/PageButton";
import "./SearchPage.css";

const SearchPage = () => {
  const params = useCheckParams();

  if (params.requireRedirect !== "")
    return <Navigate to={params.requireRedirect} />;

  return (
    <main className="Result-Container">
      <Input params={params} />
      <ResultCard params={params} />
      <PageButton numOfRows={50} params={params} />
    </main>
  );
};

export default SearchPage;
