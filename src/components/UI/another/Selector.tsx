import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
// import { useState } from "react";
import RegionSelector from "./RegionSelector";
import Category from "./Category";

interface T {
  title: string;
}

const TourUi = ({ title }: T) => {
  const category = useSelector((state: RootState) => state.category);
  // const [page, setPage] = useState<string>("1");

  return (
    <div id="picker-box">
      <RegionSelector
        title={title}
        region={category.region}
        cat1={category.cat1}
        cat2={category.cat2}
        cat3={category.cat3}
      />
      <Category
        title={title}
        region={category.region}
        cat1={category.cat1}
        cat2={category.cat2}
        cat3={category.cat3}
      />
    </div>
  );
};

export default TourUi;
