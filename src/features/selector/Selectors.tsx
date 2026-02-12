import React from "react";
import { TourDataType } from "types/FetchType";
import { CheckParams } from "hooks/useCheckParams";
import SubMenu from "./SubMenu";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import OnGoingSelector from "./OnGoingSelector";
import Tags from "./Tags";
import RowsPerPage from "./RowsPerPage";
import "./Picker.css";

interface T {
  tourDataType: TourDataType;
  numOfRows: number;
  params: CheckParams;
  setNumOfRows: React.Dispatch<React.SetStateAction<number>>;
}

const Selectors = ({ tourDataType, numOfRows, params, setNumOfRows }: T) => {
  const { month, areaCode, requireRedirect, cat1, cat2, cat3, contentTypeId } =
    params;

  return (
    <div className="Ui-Box">
      <SubMenu title={tourDataType} />
      <div>
        <div className="option-container">
          {tourDataType === "festival" && params.requireRedirect === "" && (
            <MonthSelector month={month!} />
          )}
          {requireRedirect === "" && <RegionSelector areaCode={areaCode!} />}
          {requireRedirect === "" && (
            <Category
              tourDataType={tourDataType}
              cat1={cat1!}
              cat2={cat2!}
              cat3={cat3!}
            />
          )}
        </div>
        {requireRedirect === "" && (
          <Tags contentTypeId={contentTypeId!} cat2={cat2!} cat3={cat3!} />
        )}
      </div>
      {tourDataType === "festival" && <OnGoingSelector />}
      {tourDataType !== "festival" && (
        <RowsPerPage numOfRows={numOfRows} setNumOfRows={setNumOfRows} />
      )}
    </div>
  );
};

export default React.memo(Selectors);
