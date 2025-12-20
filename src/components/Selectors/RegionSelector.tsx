import React from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { 지역코드 } from "assets/CatCode/CatCode";

interface T {
  areaCode: string;
}

const RegionSelector = ({ areaCode }: T) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAreaCode = event.target.value;

    searchParams.set("areaCode", newAreaCode);
    searchParams.set("page", "1");

    setSearchParams(searchParams);
  };

  return (
    <div className="picker">
      <select value={areaCode} onChange={pickedRegionHandler}>
        <option value="default" disabled>
          지역을 선택하세요
        </option>
        {Object.entries(지역코드).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
      <FontAwesomeIcon id="before-icon" icon={faLocationDot} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};
export default React.memo(RegionSelector);
