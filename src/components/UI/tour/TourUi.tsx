import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import TourRegion from "./TourRegion";
import { useState } from "react";

const TourUi = () => {
  const tourState = useSelector((state: RootState) => state.tour);
  const [page, setPage] = useState<string>('1');

  return (
    <div id="picker-box">
      <TourRegion region={tourState.region}/>
    </div>
  );
};

export default TourUi;
