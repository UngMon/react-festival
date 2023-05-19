import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLocationDot } from "@fortawesome/free-solid-svg-icons";

interface Props {
  region: string;
}

const TourRegion = ({ region }: Props) => {
  const navigate = useNavigate();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    navigate(`/tour/search?region=${region}&cat1=`);
  };

  return (
    <div className="picker">
      <select value={region} onChange={pickedRegionHandler}>
        <option value="default" disabled>
          지역을 선택하세요
        </option>
        <option value="서울">서울특별시</option>
        <option value="인천">인천광역시</option>
        <option value="대전">대전광역시</option>
        <option value="대구">대구광역시</option>
        <option value="광주">광주광역시</option>
        <option value="부산">부산광역시</option>
        <option value="울산">울산광역시</option>
        <option value="세종">세종특별자치시</option>
        <option value="경기">경기도</option>
        <option value="강원">강원도</option>
        <option value="충북">충청북도</option>
        <option value="충남">충청남도</option>
        <option value="경북">경상북도</option>
        <option value="경남">경상남도</option>
        <option value="전북">전라북도</option>
        <option value="전남">전라남도</option>
        <option value="제주">제주도</option>
      </select>
      <FontAwesomeIcon id="before-icon" icon={faLocationDot} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};
export default TourRegion;
