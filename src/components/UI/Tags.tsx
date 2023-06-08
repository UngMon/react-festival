import { useNavigate } from "react-router-dom";
import { tourObject, categoryObject } from "../../type/Common";
import "./Tags.css";

interface T {
  title: string;
  month: string;
  type: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const Tags = ({ title, type, month, areaCode, cat1, cat2, cat3 }: T) => {
  const navigate = useNavigate();

  const festivalTagClick = (c2: string, c3: string) => {
    let url = `/${title}/search?`;

    if (title === "festival") url += `month=${month}&`;

    url += `type=${type}&areaCode=${areaCode}&cat1=${cat1}&cat2=${c2}&cat3=${c3}`;
    navigate(url);
  };
  const array = title === "tour" ? tourObject[cat2] : categoryObject[title];
  return (
    <div className="tags">
      <div className="hash">
        {array.map((item, index) => (
          <button
            key={index}
            className={`${cat3 === item[2] ? "category-active" : "null"}`}
            onClick={() => festivalTagClick(item[1], item[2])}
          >
            {item[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tags;
