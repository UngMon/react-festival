import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import SeasonSelctor from "./SeasonSelector";
import Search from "./SearchUi";
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
  return (
    <div className="Ui-Box">
      {props.category === "region" && (
        <RegionSelector setAreaCode={props.setAreaCode!} />
      )}
      {props.category === "season" && (
        <SeasonSelctor setSeason={props.setSeason!} />
      )}
      {props.category === "all" && <MonthSelector setMonth={props.setMonth!} />}
      <Search />
    </div>
  );
};

export default UiBox;
