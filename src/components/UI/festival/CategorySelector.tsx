import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Selector.css";

interface CategoryProps {
  category: string;
  month: string;
  areaCode: string;
  setCategory: (value: string) => void;
}

const CategorySelector = (props: CategoryProps) => {
  const navigate = useNavigate();

  const pickerSelector = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    props.setCategory(value);
    navigate(`/festival/serach?month=${props.month}&region=${props.areaCode}`);
  };

  return (
    <div className="picker">
      <select value={props.category} onChange={pickerSelector}>
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
