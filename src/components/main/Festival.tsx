import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/store";
import Card from "../card/Card";
import UiBox from "../ui/UiBox";
import { festivalActions } from "../../redux/festival-slice";

const Festival = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  useEffect(() => {
    dispatch(
      festivalActions.setMonthAndRegion({
        month: params.get("month"),
        region: params.get("region"),
      })
    );
  }, [dispatch, params]);

  return (
    <main className="main-box">
      <UiBox title="festival" />
      <Card title="festival" />
    </main>
  );
};

export default Festival;
