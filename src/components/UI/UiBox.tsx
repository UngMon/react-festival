import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation } from "react-router-dom";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import SeasonSelctor from "./SeasonSelector";
import MobileSearch from "./MobileSearch";
import "./UiBox.css";

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
  const { pathname } = useLocation();
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
        <SeasonSelctor season={props.season!} setSeason={props.setSeason!} />
      )}
      {props.category === "monthly" && successGetData && (
        <MonthSelector month={props.month!} setMonth={props.setMonth!} />
      )}
      {pathname === "/search" && <MobileSearch />}
    </div>
  );
};

export default UiBox;
