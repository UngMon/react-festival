import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { 지역코드 } from "assets/CatCode/CatCode";

interface T {
  tourDataType: string;
  month?: string;
  contentTypeId: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
  setPage: (input: number) => void;
}

const RegionSelector = ({
  tourDataType,
  month,
  contentTypeId,
  areaCode,
  cat1,
  cat2,
  cat3,
  setPage
}: T) => {
  const navigate = useNavigate();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    
    let url = '?';
    if (tourDataType === "festival") url += `month=${month}&`;
    url += `contentTypeId=${contentTypeId}&areaCode=${value}&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}`;
    navigate(url);
    setPage(1);
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
export default RegionSelector;
