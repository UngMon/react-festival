import { useSearchParams } from "react-router-dom";
import SubMenu from "./SubMenu";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import OnGoingSelector from "./OnGoingSelector";
import Tags from "./Tags";
import "./UiBox.css";

interface T {
  title: string;
}

const UiBox = ({ title }: T) => {
  const [params] = useSearchParams();

  const month = params.get("month")!;
  const type = params.get("type")!;
  const areaCode = params.get("areaCode")!;
  const cat1 = params.get("cat1")!;
  const cat2 = params.get("cat2")!;
  const cat3 = params.get("cat3")!;

  return (
    <div className="Ui-Box">
      <SubMenu title={title} month={month!} />
      <div id="picker-box">
        {title === "festival" && (
          <MonthSelector month={month} type={type} areaCode={areaCode} />
        )}
        <RegionSelector
          title={title}
          month={month}
          type={type}
          areaCode={areaCode}
          cat1={cat1}
          cat2={cat2}
          cat3={cat3}
        />
        <Category
          title={title}
          month={month}
          type={type}
          areaCode={areaCode}
          cat1={cat1}
          cat2={cat2}
          cat3={cat3}
        />
      </div>
      <Tags
        title={title}
        month={month}
        type={type}
        areaCode={areaCode}
        cat1={cat1}
        cat2={cat2}
        cat3={cat3}
      />
      {title === "festival" && <OnGoingSelector />}
    </div>
  );
};

export default UiBox;
