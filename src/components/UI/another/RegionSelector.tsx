import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../../redux/store";
import { categoryActions } from "../../../redux/category-slice";

interface T {
  title: string;
  region: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const RegionSelector = ({ title, region, cat1, cat2, cat3 }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(categoryActions.regionChange({ region: value }));
    navigate(
      `/${title}/search?region=${value}&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}`
    );
  };

  return (
    <div className="picker">
      <select value={region} onChange={pickedRegionHandler}>
        <option value="default" disabled>
          지역을 선택하세요
        </option>
        <option value="1">서울특별시</option>
        <option value="2">인천광역시</option>
        <option value="3">대전광역시</option>
        <option value="4">대구광역시</option>
        <option value="5">광주광역시</option>
        <option value="6">부산광역시</option>
        <option value="7">울산광역시</option>
        <option value="8">세종특별자치시</option>
        <option value="31">경기도</option>
        <option value="32">강원도</option>
        <option value="33">충청북도</option>
        <option value="34">충청남도</option>
        <option value="35">경상북도</option>
        <option value="36">경상남도</option>
        <option value="37">전라북도</option>
        <option value="38">전라남도</option>
        <option value="39">제주도</option>
      </select>
      <FontAwesomeIcon id="before-icon" icon={faLocationDot} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};
export default RegionSelector;
