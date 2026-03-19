import { useSearchParams } from "react-router-dom";
import { 소분류 } from "constant/catCode";
import "./Tags.css";

interface T {
  contentTypeId: string;
  cat2: string;
  cat3: string;
}

const Tags = ({ contentTypeId, cat2, cat3 }: T) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!소분류[cat2]) return null;

  const festivalTagClick = (cat3: string) => {
    searchParams.set("cat3", cat3);
    searchParams.set("page", "1");

    setSearchParams(searchParams);
  };

  return (
    <div className="tags">
      <div className="hash">
        {Object.entries(소분류[cat2]).map((item) => (
          <button
            key={item[0]}
            className={`${cat3 === item[1] ? "category-active" : ""}`}
            onClick={() => festivalTagClick(item[0])}
          >
            {item[1]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tags;
