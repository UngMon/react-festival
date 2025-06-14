import React from "react";
import { TitleType } from "type/FetchType";
import { useCheckParams, CheckParams } from "hooks/useCheckParams";
import SubMenu from "./SubMenu";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import OnGoingSelector from "./OnGoingSelector";
import Tags from "./Tags";
import RowsPerPage from "./RowsPerPage";
import "./Picker.css";

interface T {
  title: TitleType;
  numOfRows: number;
  setNumOfRows: React.Dispatch<React.SetStateAction<number>>;
}
 
const Selectors = ({ title, numOfRows, setNumOfRows }: T) => {
  const { contentTypeId, month, areaCode, cat1, cat2, cat3, requireRedirect } =
    useCheckParams(title) as CheckParams;

  return (
    <div className="Ui-Box">
      <SubMenu title={title} />
      <div>
        <div className="option-container">
          {title === "festival" && requireRedirect === "" && (
            <MonthSelector
              month={month!}
              type={contentTypeId!}
              areaCode={areaCode!}
            />
          )}
          {requireRedirect === "" && (
            <RegionSelector
              title={title}
              month={month}
              contentTypeId={contentTypeId!}
              areaCode={areaCode!}
              cat1={cat1!}
              cat2={cat2!}
              cat3={cat3!}
            />
          )}
          {requireRedirect === "" && (
            <Category
              title={title}
              month={month}
              contentTypeId={contentTypeId!}
              areaCode={areaCode!}
              cat1={cat1!}
              cat2={cat2!}
              cat3={cat3!}
            />
          )}
        </div>
        {requireRedirect === "" && (
          <Tags
            title={title}
            month={month!}
            contentTypeId={contentTypeId!}
            areaCode={areaCode!}
            cat1={cat1!}
            cat2={cat2!}
            cat3={cat3!}
          />
        )}
      </div>
      {title === "festival" && <OnGoingSelector />}
      {title !== "festival" && (
        <RowsPerPage numOfRows={numOfRows} setNumOfRows={setNumOfRows} />
      )}
    </div>
  );
}

export default React.memo(Selectors);
