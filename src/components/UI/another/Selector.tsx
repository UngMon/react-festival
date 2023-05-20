import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import TourRegion from "./TourRegion";
import Category from "./Category";

interface T {
  title: string;
}

const TourUi = ({ title }: T) => {
  const tour = useSelector((state: RootState) => state.tour);
  const culture = useSelector((state: RootState) => state.culture);
  const [page, setPage] = useState<string>("1");

  const region = title === 'tour' ? tour.region : culture.region;
  const cat1 = title === 'tour' ? tour.cat1 : culture.cat1;
  const cat2 = title === 'tour' ? tour.cat2 : culture.cat2;

  return (
    <div id="picker-box">
      <TourRegion title={title} region={region} />
      <Category title={title} cat1={cat1} cat2={cat2}/>
    </div>
  );
};

export default TourUi;
