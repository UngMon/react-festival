import { useSearchParams } from "react-router-dom";
import { TagCode } from "assets/CatCode/CatCode";
import "./Tags.css";

interface T {
  contentTypeId: string;
  cat2: string;
  cat3: string;
}

const Tags = ({ contentTypeId, cat2, cat3 }: T) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const festivalTagClick = (cat3: string) => {
    searchParams.set("cat3", cat3);
    searchParams.set("page", "1");

    setSearchParams(searchParams);
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
