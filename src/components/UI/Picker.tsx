import SubMenu from "./SubMenu";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import OnGoingSelector from "./OnGoingSelector";
import Tags from "./Tags";
import useAllParams from "../../hooks/useAllParams";
import "./Picker.css";

interface T {
  title: string;
}

const UiBox = ({ title }: T) => {
  const { contentTypeId, month, areaCode, cat1, cat2, cat3 } =
    useAllParams(title);

  return (
    <div className="Ui-Box">
      <SubMenu title={title} />
      {title !== "trend" && (
        <div>
          <div className="option-container">
            {title === "festival" && (
              <MonthSelector
                month={month}
                type={contentTypeId}
                areaCode={areaCode}
              />
            )}
            <RegionSelector
              title={title}
              month={month}
              contentTypeId={contentTypeId}
              areaCode={areaCode}
              cat1={cat1}
              cat2={cat2}
              cat3={cat3}
            />
            <Category
              title={title}
              month={month}
              contentTypeId={contentTypeId}
              areaCode={areaCode}
              cat1={cat1}
              cat2={cat2}
              cat3={cat3}
            />
          </div>
          <Tags
            title={title}
            month={month}
            contentTypeId={contentTypeId}
            areaCode={areaCode}
            cat1={cat1}
            cat2={cat2}
            cat3={cat3}
          />
        </div>
      )}
      {title === "festival" && <OnGoingSelector />}
    </div>
  );
};

export default UiBox;
