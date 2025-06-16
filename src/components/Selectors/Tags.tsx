import { useNavigate } from "react-router-dom";
import { TagCode } from "assets/CatCode/CatCode";
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
  console.log("Tags Rendering");

  const festivalTagClick = (cat3: string) => {
    let url = `/${title}?`;

    if (title === "festival") url += `month=${month}&`;

    url += `contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}`;
    navigate(url);
  };

  const tagObject =
    contentTypeId === "15" || contentTypeId === "25"
      ? TagCode[contentTypeId]
      : TagCode[cat2];

  return (
    <div className="tags">
      <div className="hash">
        {tagObject &&
          Object.entries(tagObject).map((item, index) => (
            <button
              key={index}
              className={`${cat3 === item[1] ? "category-active" : ""}`}
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
