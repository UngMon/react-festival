import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import SeasonSelctor from "./SeasonSelector";
import Search from "./SearchUi";
import "./UiBox.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface MonthProps {
  category: string;
  month?: string;
  setMonth?: (value: string) => void;
  areaCode?: string;
  setAreaCode?: (value: string) => void;
  season?: string;
  setSeason?: (value: string) => void;
}

const UiBox = (props: MonthProps) => {
  const successGetData = useSelector(
    (state: RootState) => state.festival.successGetData
  );

  return (
    <div className="Ui-Box">
      {props.category === "region" && successGetData && (
        <RegionSelector
          areaCode={props.areaCode!}
          setAreaCode={props.setAreaCode!}
        />
      )}
      {props.category === "season" && successGetData && (
        <SeasonSelctor
          season={props.season!}
          setSeason={props.setSeason!}
        />
      )}
      {props.category === "monthly" && successGetData && (
        <MonthSelector
          month={props.month!}
          setMonth={props.setMonth!}
        />
      )}
      {successGetData && <Search />}
    </div>
  );
};

export default UiBox;
