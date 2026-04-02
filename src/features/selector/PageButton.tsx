import { useSearchParams } from "react-router-dom";
import { createPageKey } from "utils/createPageKey";
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
  numOfRows: number;
  params: CheckParams;
}

const PageButton = ({ numOfRows, params }: T) => {
  const page = Number(params.page);
  const page_key = createPageKey(numOfRows, params);
  const [searchParams, setSearchParams] = useSearchParams();

  const data_of_page = useSelector(
    (state: RootState) => state.tour.datas[page_key]
  );

  let totalCount = data_of_page?.totalCount || 1

  const MaxPageCount: number = Math.ceil(totalCount / numOfRows);
  const currentGroup: number = Math.floor((page - 1) / 10); // 현재 10단위 그룹 (0부터 시작)
  const startPage: number = currentGroup * 10 + 1;
  const endPage: number = Math.min(startPage + 9, MaxPageCount);

  const arrowButtonHandler = (type: string) => {
    if (MaxPageCount === 0) return;

    let newPage: number = page;

    if (type === "back" && page >= 2) newPage -= 1;

    if (type === "forward" && page < MaxPageCount) newPage += 1;

    if (type === "prev") newPage = 1;

    if (type === "next") newPage = MaxPageCount;

    clickPageButton(newPage);
  };

  const clickPageButton = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
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
        (_, i) => i + startPage,
      ).map((num) => (
        <button
          type="button"
          className={`page-button ${+page! === num ? "current-page" : ""}`}
          key={num}
          onClick={() => clickPageButton(num)}
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
