import {
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PageButton.css";

interface T {
  title: string;
  numOfRows: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const pageCounts: Record<string, number> = {
  tour: 8450,
  culture: 1887,
  travel: 888,
  leports: 3949,
};

const PageButton = ({ title, numOfRows, page, setPage }: T) => {
  const MaxPageCount: number = Math.ceil(pageCounts[title] / numOfRows);
  const currentGroup: number = Math.floor((page - 1) / 10); // 현재 10단위 그룹 (0부터 시작)
  const startPage: number = currentGroup * 10 + 1;
  const endPage: number = Math.min(startPage + 9, MaxPageCount);

  const backAndForwardHandler = (type: string) => {
    if (type === "back" && page >= 2) {
      setPage(page - 1);
    }
    if (type === "forward" && page < MaxPageCount) {
      setPage(page + 1);
    }
  };

  const prevAndNextButton = (type: string) => {
    if (type === "prev") setPage(1);
    else setPage(MaxPageCount);
  };

  return (
    <div className="page-button-box">
      <button
        type="button"
        style={{ transform: "rotate(180deg)" }}
        onClick={() => prevAndNextButton("prev")}
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
      <button
        type="button"
        id="page-left"
        onClick={() => backAndForwardHandler("back")}
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
        onClick={() => backAndForwardHandler("forward")}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <button type="button" onClick={() => prevAndNextButton("next")}>
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
    </div>
  );
};

export default PageButton;
