import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { 지역코드 } from "../../type/Common";

interface T {
  title: string;
  month?: string;
  type: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const RegionSelector = ({
  title,
  month,
  type,
  areaCode,
  cat1,
  cat2,
  cat3,
}: T) => {
  const navigate = useNavigate();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    let url = '?';
    if (title === "festival") url += `month=${month}&`;
    url += `type=${type}&areaCode=${value}&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}`;
    
    navigate(url);
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
