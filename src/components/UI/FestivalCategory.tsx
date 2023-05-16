import { MouseEvent, useRef, useState } from "react";

const FestivalCategory = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  console.log("??????");
  const onDragStart = (e: MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current!.scrollLeft);
  };

  const onDragEnd = (e: MouseEvent) => {
    setIsDrag(false);
  };

  const onDragMove = (e: MouseEvent) => {
    if (isDrag) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current!;

      scrollRef.current!.scrollLeft = startX - e.pageX;

      if (scrollLeft === 0) {
        setStartX(e.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(e.pageX + scrollLeft);
      }
    }
  };

  const throttle = (onDragMove: (e: MouseEvent) => void, ms: number) => {
    let throttled = false;
    return (e: MouseEvent) => {
      if (!throttled) {
        throttled = true;
        setTimeout(() => {
          onDragMove(e);
          throttled = false;
        }, ms);
      }
    };
  };
  const delay = 80;
  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <div className="Festival-Body">
      <div className="tags">
        <div className="hash">
          <button># 문화관광축제</button>
          <button># 일반축제</button>
        </div>
      </div>
      <div className="tags">
        <div
          className="hash"
          ref={scrollRef}
          onMouseDown={(e: MouseEvent) => onDragStart(e)}
          onMouseMove={onThrottleDragMove}
          onMouseUp={(e: MouseEvent) => onDragEnd(e)}
          onMouseLeave={(e: MouseEvent) => onDragEnd(e)}
        >
          <button># 전체</button>
          <button># 전통공연</button>
          <button># 연극</button>
          <button># 뮤지컬</button>
          <button># 오페라</button>
          <button># 전시회</button>
          <button># 박람회</button>
          <button># 무용</button>
          <button># 클래식음악회</button>
          <button># 대중콘서트</button>
          <button># 영화</button>
          <button># 스포츠경기</button>
          <button># 기타행사</button>
        </div>
      </div>
    </div>
  );
};

export default FestivalCategory;
