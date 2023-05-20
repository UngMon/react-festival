import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
// import "";

interface T {
  title: string;
  cat1: string;
  cat2: string
}

const Cat1 = ({ title, cat1, cat2 }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickerSelector = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // dispatch(festivalActions.catChange({ cat2: value, cat3: "all" }));
    // navigate(`/${title}/serach?month=${title}&region=${areaCode}`);
  };

  return (
    <div id="picker-box">
      <div className="picker">
        <select value={cat1} onChange={pickerSelector}>
          <option value="all"># Step1</option>
          <option value="A0207"># 축제</option>
          <option value="A0208"># 공연/행사</option>
        </select>
        <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
        <FontAwesomeIcon icon={faCheck} />
      </div>
      <div className="picker">
        <select value={cat2} onChange={pickerSelector}>
          <option value="all"># Step2</option>
          <option value="A0207"># 축제</option>
          <option value="A0208"># 공연/행사</option>
        </select>
        <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
        <FontAwesomeIcon icon={faCheck} />
      </div>
    </div>
  );
};

export default Cat1;
