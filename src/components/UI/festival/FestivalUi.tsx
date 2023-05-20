import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import CategorySelector from "./CategorySelector";
import FestivalTags from "./FestivalTags";
import OnGoingSelector from "./OnGoingSelector";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface T {
  행사상태?: [boolean, boolean, boolean];
  행사상태설정?: React.Dispatch<
    React.SetStateAction<[boolean, boolean, boolean]>
  >;
}

const FestivalUi = (props: T) => {
  const festival = useSelector((state: RootState) => state.festival);

  return (
    <>
      <div id="picker-box">
        <MonthSelector month={festival.month} areaCode={festival.areaCode} />
        <RegionSelector month={festival.month} areaCode={festival.areaCode} />
        <CategorySelector
          month={festival.month}
          areaCode={festival.areaCode}
          cat2={festival.cat2}
        />
      </div>
      <div className="Select-Table">
        <FestivalTags cat2={festival.cat2} cat3={festival.cat3} />
      </div>
      <OnGoingSelector
        행사상태={festival.행사상태}
      />
    </>
  );
};

export default FestivalUi;
