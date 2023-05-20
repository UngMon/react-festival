import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import "./Selector.css";
import { festivalActions } from "../../../redux/festival-slice";

interface T {
  cat2: string;
  month: string;
  areaCode: string;
}

const CategorySelector = ({ cat2, month, areaCode }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickerSelector = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(festivalActions.catChange({ cat2: value, cat3: "all" }));
    navigate(`/festival/serach?month=${month}&region=${areaCode}`);
  };

  return (
    <div className="picker">
      <select value={cat2} onChange={pickerSelector}>
        <option value="all"># 카테고리</option>
        <option value="A0207"># 축제</option>
        <option value="A0208"># 공연/행사</option>
      </select>
      <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};

export default CategorySelector;
