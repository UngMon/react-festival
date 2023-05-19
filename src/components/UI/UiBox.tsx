import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FestivalUi from "./festival/FestivalUi";
import "./UiBox.css";
import TourUi from "./tour/TourUi";

interface MonthProps {
  title: string;
  month?: string;
  setMonth?: (value: string) => void;
  areaCode?: string;
  setAreaCode?: (value: string) => void;
  cat2?: string;
  setCat2?: (value: string) => void;
  cat3?: string;
  setCat3?: (value: string) => void;
  행사상태?: [boolean, boolean, boolean];
  행사상태설정?: React.Dispatch<
    React.SetStateAction<[boolean, boolean, boolean]>
  >;
}

const UiBox = (props: MonthProps) => {
  // const successGetData = useSelector(
  //   (state: RootState) => state.festival.successGetData
  // );

  return (
    <div className="Ui-Box">
      {props.title === "tour" && <TourUi />}
      {props.title === "festival" && (
        <FestivalUi
          month={props.month!}
          setMonth={props.setMonth!}
          areaCode={props.areaCode!}
          setAreaCode={props.setAreaCode!}
          cat2={props.cat2!}
          setCat2={props.setCat2!}
          cat3={props.cat3!}
          setCat3={props.setCat3!}
          행사상태={props.행사상태!}
          행사상태설정={props.행사상태설정!}
        />
      )}
    </div>
  );
};

export default UiBox;
