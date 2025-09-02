import { TitleType } from "type/FetchType";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { CheckParams } from "hooks/useCheckParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./PageButton.css";

interface T {
  title: TitleType;
  numOfRows: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  params: CheckParams;
}

const PageButton = ({ title, numOfRows, page, setPage, params }: T) => {
  const { contentTypeId, areaCode, cat1, cat2, cat3, keyword } =
    params as CheckParams;

  let page_key =
    title === "search"
      ? `${contentTypeId}-${keyword}-${page}`
      : `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}-${numOfRows}-${page}`;

  const data = useSelector((state: RootState) => state.data[title]);

  if (!data[page_key] || !data[page_key].totalCount) return null;

  const page_total_count = data[page_key].totalCount;

  const MaxPageCount: number = Math.ceil(page_total_count / numOfRows);
  const currentGroup: number = Math.floor((page - 1) / 10); // 현재 10단위 그룹 (0부터 시작)
  const startPage: number = currentGroup * 10 + 1;
  const endPage: number = Math.min(startPage + 9, MaxPageCount);

  const arrowButtonHandler = (type: string) => {
    if (MaxPageCount === 0) return;

    if (type === "back" && page >= 2) setPage(page - 1);

    if (type === "forward" && page < MaxPageCount) setPage(page + 1);

    if (type === "prev") setPage(1);

    if (type === "next") setPage(MaxPageCount);
  };

  return (
    <div className="page-button-box">
      <button
        type="button"
        style={{ transform: "rotate(180deg)" }}
        onClick={() => arrowButtonHandler("prev")}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
      <button
        type="button"
        id="page-left"
        onClick={() => arrowButtonHandler("back")}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => i + startPage
      ).map((num) => (
        <button
          type="button"
          className={`page-button ${page === num ? "current-page" : ""}`}
          key={num}
          onClick={() => setPage(num)}
        >
          <span>{num}</span>
        </button>
      ))}
      <button
        type="button"
        id="page-right"
        onClick={() => arrowButtonHandler("forward")}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <button type="button" onClick={() => arrowButtonHandler("next")}>
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
};

export default PageButton;
