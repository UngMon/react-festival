import { useNavigate } from "react-router-dom";
import { TagCode } from "assets/CatCode/CatCode";
import "./Tags.css";

interface T {
  tourDataType: string;
  month: string;
  contentTypeId: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
  setPage: (input: number) => void;
}

const Tags = ({
  tourDataType,
  contentTypeId,
  month,
  areaCode,
  cat1,
  cat2,
  cat3,
  setPage
}: T) => {
  const navigate = useNavigate();

  const festivalTagClick = (cat3: string) => {
    let url = `/${tourDataType}?`;

    if (tourDataType === "festival") url += `month=${month}&`;

    url += `contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}`;
    navigate(url);
    setPage(1);
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
