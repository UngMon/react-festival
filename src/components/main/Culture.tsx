import { useEffect } from "react";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getTouristData } from "../../redux/fetch-action";
import UiBox from "../ui/UiBox";
import Card from "../card/Card";

const Culture = () => {
  const dispatch = useAppDispatch();
  const cultureState = useSelector((state: RootState) => state.culture);

  useEffect(() => {
    if (!cultureState.successGetData) {
      const parameter = {
        page: "1",
        region: "서울",
        type: "14",
      };
      dispatch(getTouristData(parameter));
    }
  }, [dispatch, cultureState]);
  console.log("???");
  return (
    <main className="main-box">
      <UiBox title="culture" />
      <Card title="culture" />
    </main>
  );
};

export default Culture;
