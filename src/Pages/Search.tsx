import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import UiBox from "../components/UI/UiBox";
import Card from "../components/Card/Card";
import Loading from "../components/UI/Loading";

const Search = () => {
  const festivalState = useSelector((state: RootState) => state.festival);

  return (
    <>
      <main className="main-box">
        <UiBox category="search" />
        {!festivalState.sortedSeason && <Loading />}
        {festivalState.sortedSeason && <Card type={"search"} month="전체" />}
      </main>
    </>
  );
};

export default Search;
