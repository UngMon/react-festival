import FestivalUi from "./festival/FestivalUi";
import Selector from "./another/Selector";
import "./UiBox.css";

interface MonthProps {
  title: string;
}

const UiBox = (props: MonthProps) => {
  return (
    <div className="Ui-Box">
      {props.title === "tour" && <Selector title={props.title}/>}
      {props.title === "festival" && <FestivalUi />}
    </div>
  );
};

export default UiBox;
