import { useNavigate } from "react-router-dom";
import { TagCode, TitleEnglishName } from "../../type/Common";
import "./Tags.css";

interface T {
  title: string;
  month: string;
  contentTypeId: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const Tags = ({
  title,
  contentTypeId,
  month,
  areaCode,
  cat1,
  cat2,
  cat3,
}: T) => {
  const navigate = useNavigate();
 
  const festivalTagClick = (c3: string) => {

    let url = `/${TitleEnglishName[title]}?`;

    if (title === "축제/공연/행사") url += `month=${month}&`;

    url += `contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${cat1}&cat2=${cat2}&cat3=${c3}`;
    navigate(url);
  };

  const array = contentTypeId === "15" ? TagCode[contentTypeId] : TagCode[cat2];

  return (
    <div className="tags">
      <div className="hash">
        {array &&
          Object.entries(array).map((item, index) => (
            <button
              key={index}
              className={`${cat3 === item[1] ? "category-active" : "null"}`}
              onClick={() => festivalTagClick(item[1])}
            >
              {item[0]}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tags;
