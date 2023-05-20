import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../../redux/store";
import { festivalActions } from "../../../redux/festival-slice";
import "./Selector.css";

interface T {
  month: string;
  areaCode: string;
}

const RegionSelector = ({ month, areaCode }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(festivalActions.setMonthAndRegion({ month, region: value }));
    navigate(`/festival/search?month=${month}&region=${value}`);
  };

  return (
    <div className="picker">
      <select value={areaCode} onChange={pickedRegionHandler}>
        <option value="default" disabled>
          지역을 선택하세요
        </option>
        <option value="0">전체</option>
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
