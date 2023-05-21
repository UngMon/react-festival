import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { categoryActions } from "../../redux/category-slice";
import UiBox from "../ui/UiBox";
import Card from "../card/Card";

const Culture = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  useEffect(() => {
    dispatch(categoryActions.regionChange({ region: params.get("region") }));
  }, [dispatch, params]);

  return (
    <main className="main-box">
      <UiBox title="culture" />
      <Card title="culture" />
    </main>
  );
};

export default Culture;
