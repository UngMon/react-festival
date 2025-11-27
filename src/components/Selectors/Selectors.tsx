import React from "react";
import { TourDataType } from "type/FetchType";
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
  tourDataType: TourDataType;
  numOfRows: number;
  setNumOfRows: React.Dispatch<React.SetStateAction<number>>;
  setPage: (input: number) => void;
}

const Selectors = ({ tourDataType, numOfRows, setNumOfRows, setPage }: T) => {
  const { contentTypeId, month, areaCode, cat1, cat2, cat3, requireRedirect } =
    useCheckParams(tourDataType) as CheckParams;

  return (
    <div className="Ui-Box">
      <SubMenu title={tourDataType} />
      <div>
        <div className="option-container">
          {tourDataType === "festival" && requireRedirect === "" && (
            <MonthSelector
              month={month!}
              type={contentTypeId!}
              areaCode={areaCode!}
            />
          )}
          {requireRedirect === "" && (
            <RegionSelector
              tourDataType={tourDataType}
              month={month}
              contentTypeId={contentTypeId!}
              areaCode={areaCode!}
              cat1={cat1!}
              cat2={cat2!}
              cat3={cat3!}
              setPage={setPage}
            />
          )}
          {requireRedirect === "" && (
            <Category
              tourDataType={tourDataType}
              month={month}
              contentTypeId={contentTypeId!}
              areaCode={areaCode!}
              cat1={cat1!}
              cat2={cat2!}
              cat3={cat3!}
              setPage={setPage}
            />
          )}
        </div>
        {requireRedirect === "" && (
          <Tags
            tourDataType={tourDataType}
            month={month!}
            contentTypeId={contentTypeId!}
            areaCode={areaCode!}
            cat1={cat1!}
            cat2={cat2!}
            cat3={cat3!}
            setPage={setPage}
          />
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
