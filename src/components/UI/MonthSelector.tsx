import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCalendar } from "@fortawesome/free-solid-svg-icons";

interface T {
  month: string;
  type: string;
  areaCode: string;
}

const MonthSelector = ({ month, type, areaCode }: T) => {
  const navigate = useNavigate();

  const pickedMonthHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    navigate(
      `/festival?contentTypeId=${type}&month=${value}&areaCode=${areaCode}&cat1=all&cat2=all&cat3=all`
    );
  };

  return (
    <div className="picker">
      <select value={month} onChange={pickedMonthHandler}>
        <option value="default" disabled>
          월을 선택하세요
        </option>
        <option value="01">1월</option>
        <option value="02">2월</option>
        <option value="03">3월</option>
        <option value="04">4월</option>
        <option value="05">5월</option>
        <option value="06">6월</option>
        <option value="07">7월</option>
        <option value="08">8월</option>
        <option value="09">9월</option>
        <option value="10">10월</option>
        <option value="11">11월</option>
        <option value="12">12월</option>
      </select>
      <FontAwesomeIcon id="before-icon" icon={faCalendar} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};

export default MonthSelector;
