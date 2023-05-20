// import { MouseEvent, useRef, useState } from "react";

import { useAppDispatch } from "../../../redux/store";
import { festivalActions } from "../../../redux/festival-slice";
import "./FestivalTags.css";

interface T {
  cat2: string;
  cat3: string;
}

const FestivalTags = ({ cat2, cat3 }: T) => {
  const dispatch = useAppDispatch();

  const festivalTagClick = (va1: string, va2: string) => {
    dispatch(festivalActions.catChange({ cat2: va1, cat3: va2 }));
  };

  // const scrollRef = useRef<HTMLDivElement>(null);
  // const [isDrag, setIsDrag] = useState(false);
  // const [startX, setStartX] = useState<number>(0);
  // console.log("??????");
  // const onDragStart = (e: MouseEvent) => {
  //   e.preventDefault();
  //   setIsDrag(true);
  //   setStartX(e.pageX + scrollRef.current!.scrollLeft);
  // };

  // const onDragEnd = (e: MouseEvent) => {
  //   setIsDrag(false);
  // };

  // const onDragMove = (e: MouseEvent) => {
  //   if (isDrag) {
  //     const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current!;

  //     scrollRef.current!.scrollLeft = startX - e.pageX;

  //     if (scrollLeft === 0) {
  //       setStartX(e.pageX);
  //     } else if (scrollWidth <= clientWidth + scrollLeft) {
  //       setStartX(e.pageX + scrollLeft);
  //     }
  //   }
  // };

  // const throttle = (onDragMove: (e: MouseEvent) => void, ms: number) => {
  //   let throttled = false;
  //   return (e: MouseEvent) => {
  //     if (!throttled) {
  //       throttled = true;
  //       setTimeout(() => {
  //         onDragMove(e);
  //         throttled = false;
  //       }, ms);
  //     }
  //   };
  // };
  // const delay = 80;
  // const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <>
      {cat2 === "A0207" && (
        <div className="tags">
          <div className="hash">
            <button
              className={`${cat3 === "all" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0207", "all")}
            >
              # 전체
            </button>
            <button
              className={`${cat3 === "A02070100" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0207", "A02070100")}
            >
              # 문화관광축제
            </button>
            <button
              className={`${cat3 === "A02070200" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0207", "A02070200")}
            >
              # 일반축제
            </button>
          </div>
        </div>
      )}
      {cat2 === "A0208" && (
        <div className="tags">
          <div
            className="hash"
            // ref={scrollRef}
            // onMouseDown={(e: MouseEvent) => onDragStart(e)}
            // onMouseMove={onThrottleDragMove}
            // onMouseUp={(e: MouseEvent) => onDragEnd(e)}
            // onMouseLeave={(e: MouseEvent) => onDragEnd(e)}
          >
            <button
              className={`${cat3 === "all" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "all")}
            >
              # 전체
            </button>
            <button
              className={`${cat3 === "A02080100" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080100")}
            >
              # 전통공연
            </button>
            <button
              className={`${cat3 === "A02080200" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080200")}
            >
              # 연극
            </button>
            <button
              className={`${cat3 === "A02080300" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080300")}
            >
              # 뮤지컬
            </button>
            <button
              className={`${cat3 === "A02080400" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080400")}
            >
              # 오페라
            </button>
            <button
              className={`${cat3 === "A02080500" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080500")}
            >
              # 전시회
            </button>
            <button
              className={`${cat3 === "A02080600" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080600")}
            >
              # 박람회
            </button>
            <button
              className={`${cat3 === "A02080800" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080800")}
            >
              # 무용
            </button>
            <button
              className={`${cat3 === "A02080900" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02080900")}
            >
              # 클래식음악회
            </button>
            <button
              className={`${cat3 === "A02081000" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02081000")}
            >
              # 대중콘서트
            </button>
            <button
              className={`${cat3 === "A02081100" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02081100")}
            >
              # 영화
            </button>
            <button
              className={`${cat3 === "A02081200" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02081200")}
            >
              # 스포츠경기
            </button>
            <button
              className={`${cat3 === "A02081300" ? "category-active" : "null"}`}
              onClick={() => festivalTagClick("A0208", "A02081300")}
            >
              # 기타행사
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FestivalTags;
