import React from "react";
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
  numOfRows: number;
  params: CheckParams;
  setNumOfRows: React.Dispatch<React.SetStateAction<number>>;
}

const Selectors = ({ numOfRows, params, setNumOfRows }: T) => {
  const { month, areaCode, requireRedirect, cat1, cat2, cat3, contentTypeId } =
    params;

  return (
    <div className="Ui-Box">
      <SubMenu cat1={cat1} />
      <div>
        <div className="option-container">
          {cat1 === "EV" && params.requireRedirect === "" && (
            <MonthSelector month={month!} />
          )}
          {requireRedirect === "" && <RegionSelector areaCode={areaCode!} />}
          {requireRedirect === "" && <Category cat1={cat1!} cat2={cat2!} />}
        </div>
        {requireRedirect === "" && (
          <Tags contentTypeId={contentTypeId!} cat2={cat2!} cat3={cat3!} />
        )}
      </div>
      {cat1 === "EV" ? ( // 대분류가 축제/공연/행사
        <OnGoingSelector />
      ) : (
        <RowsPerPage numOfRows={numOfRows} setNumOfRows={setNumOfRows} />
      )}
    </div>
  );
};

export default React.memo(Selectors);
