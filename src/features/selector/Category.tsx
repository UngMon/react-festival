import { useSearchParams } from "react-router-dom";
import { 중분류 } from "constant/catCode";
import "./Category.css";

interface T {
  cat1: string;
  cat2: string;
}

const Category = ({ cat1, cat2 }: T) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pickerSelector = (
    event: React.ChangeEvent<HTMLSelectElement>,
    cat: string,
  ) => {
    const newValue = event.target.value;

    if (cat === "cat2") {
      searchParams.set("cat2", newValue);
      searchParams.set("cat3", "all");
    }

    if (cat === "cat3") {
      searchParams.set("cat3", newValue);
    }

    searchParams.set("page", "1");

    setSearchParams(searchParams);
  };

  return (
    <>
      {
        <div className="picker">
          <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
            {Object.entries(중분류[cat1]).map((item) => (
              <option key={item[0]} value={item[0]}>
                {item[1]}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined picker-icon">folder_open</span>
        </div>
      }
    </>
  );
};

export default Category;
