import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./RowsPerPage.css";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

interface T {
  numOfRows: number;
  setNumOfRows: React.Dispatch<React.SetStateAction<number>>;
}

const RowsPerPage = ({ numOfRows, setNumOfRows }: T) => {
  const divref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (divref.current?.contains(target)) return;

      setOpen(false);
    };

    window.addEventListener("click", (e) => clickHandler(e));

    return () => window.removeEventListener("click", clickHandler);
  });

  return (
    <div className="rows-per-page">
      <div id="rows-text">{"한 페이지"}</div>
      <div
        ref={divref}
        className={`rows-dropdown ${open ? "row-active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div id="numOfRows">
          <span>{numOfRows}</span>
        </div>
        {open && (
          <ul>
            <li onClick={() => setNumOfRows(50)}>50</li>
            <li onClick={() => setNumOfRows(100)}>100</li>
            <li onClick={() => setNumOfRows(150)}>150</li>
            <li onClick={() => setNumOfRows(200)}>200</li>
          </ul>
        )}
        <div
          id="dropdown-arrow"
          style={{ transform: open ? "rotate(180deg)" : "" }}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      <div id="rows-text">{"개씩 보기"}</div>
    </div>
  );
};

export default RowsPerPage;
