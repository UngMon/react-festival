import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CurrentSeason } from "../../modules/CurrentSeason";
import UiBox from "../UI/UiBox";
import Card from "../Card/Card";
import Loading from "../UI/Loading";

const Seasons = () => {

  const { seasonKey } = useParams();

  const festivalState = useSelector((state: RootState) => state.festival);

  const [season, setSeason] = useState<string>(seasonKey || CurrentSeason());

  return (
    <main className="main-box">
      <UiBox category={"season"} season={season} setSeason={setSeason} />
      {!festivalState.sortedSeason && <Loading />}
      {festivalState.sortedSeason && (
        <Card type={"season"} season={season} month="전체" />
      )}
    </main>
  );
};

export default Seasons;
