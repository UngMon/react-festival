import { useEffect } from "react";
import { useAppDispatch } from "../../redux/store";
import { categoryActions } from "../../redux/category-slice";
import { useSearchParams } from "react-router-dom";
import UiBox from "../ui/UiBox";
import Card from "../card/Card";

const Tour = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  useEffect(() => {
    dispatch(categoryActions.regionChange({ region: params.get("region") }));
  }, [dispatch, params]);

  return (
    <main className="main-box">
      <UiBox title="tour" />
      <Card title="tour" />
    </main>
  );
};

export default Tour;
