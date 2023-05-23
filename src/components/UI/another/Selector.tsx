import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import { useEffect } from "react";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import { useSearchParams } from "react-router-dom";
import { categoryActions } from "../../../redux/category-slice";

interface T {
  title: string;
}

let isMount = true;

const TourUi = ({ title }: T) => {
  const dispatch = useAppDispatch();
  const category = useSelector((state: RootState) => state.category);
  const [params] = useSearchParams();

  useEffect(() => {
    if (isMount) { // 페이지 새로고침시에 현재 url의 정보를 받아오게 함
      dispatch(
        categoryActions.setMount({
          region: params.get("region"),
          cat1: params.get("cat1"),
          cat2: params.get("cat2"),
          cat3: params.get("cat3"),
        })
      );
      isMount = false;
    }
  }, [dispatch, params]);

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
