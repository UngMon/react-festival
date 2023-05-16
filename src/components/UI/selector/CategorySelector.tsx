import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";

import "./Selector.css";

const CategorySelector = () => {
  return (
    <div className="picker">
      <select>
        <option value="default" disabled>
          카테고리
        </option>
        <option value="01"># 축제</option>
        <option value="02"># 공연/행사</option>
      </select>
      <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
      <FontAwesomeIcon icon={faCheck} />
    </div>
  );
};

export default CategorySelector;
