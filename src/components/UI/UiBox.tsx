import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation } from "react-router-dom";
import MonthSelector from "./selector/MonthSelector";
import RegionSelector from "./selector/RegionSelector";
import MobileSearch from "./MobileSearch";
import OnGoingSelector from "./OnGoingSelector";
import FestivalTags from "./tags/FestivalTags";
import CategorySelector from "./selector/CategorySelector";
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
      {successGetData && (
        <div id="picker-box">
          <MonthSelector month={props.month!} setMonth={props.setMonth!} />
          <RegionSelector
            areaCode={props.areaCode!}
            setAreaCode={props.setAreaCode!}
          />
          <CategorySelector />
        </div>
      )}
      <div className="Select-Table">
        <FestivalTags />
      </div>

      {pathname === "/search" && <MobileSearch />}
      <OnGoingSelector />
    </div>
  );
};

export default UiBox;
