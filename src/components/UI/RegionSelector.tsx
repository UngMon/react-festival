import { useNavigate } from "react-router-dom";

interface RegionProps {
  areaCode: string;
  setAreaCode: (value: string) => void;
}

const RegionSelector = (props: RegionProps) => {
  const navigate = useNavigate();

  const pickedRegionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    props.setAreaCode(value);
    navigate(`/regions/${value}`)
  };

  return (
    <div className="picker-month">
      <select value={props.areaCode} onChange={pickedRegionHandler}>
        <option value="default" disabled>
          지역을 선택하세요
        </option>
        <option value="1">서울</option>
        <option value="2">인천</option>
        <option value="3">대전</option>
        <option value="4">대구</option>
        <option value="5">광주</option>
        <option value="6">부산</option>
        <option value="7">울산</option>
        <option value="8">세종</option>
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
      <h4 className="picker-month-h">지역을 선택하세요</h4>
    </div>
  );
};

export default RegionSelector;
