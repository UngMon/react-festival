import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { getTouristData } from "../../redux/fetch-action";
import UiBox from "../ui/UiBox";
import Card from "../card/Card";

const Tour = () => {
  const dispatch = useAppDispatch();
  const tourState = useSelector((state: RootState) => state.tour);

  useEffect(() => {
    if (!tourState.successGetData) {
      const parameter = {
        page: tourState.page,
        region: tourState.region,
        type: "12",
      };
      dispatch(getTouristData(parameter));
    }
  }, [dispatch, tourState]);
  console.log("???");
  return (
    <main className="main-box">
      <UiBox title="tour" />
      <Card title="tour" />
    </main>
  );
};

export default Tour;