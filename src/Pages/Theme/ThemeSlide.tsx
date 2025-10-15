import { useCallback, useEffect, useRef, useState } from "react";
import "./ThemeSlide.css";

interface T {
  images: string[];
  theme_number: string | null;
  clickedElement: React.MutableRefObject<HTMLElement | null>;
}

const themeObject: { [key: string]: string } = {
  "0": "cafe",
  "1": "culture",
  "2": "flagship",
  "3": "music",
  "4": "bar",
};

const ThemeSlide = ({ images, clickedElement, theme_number }: T) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [scrollX, setScrollX] = useState<number>(0);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const startX = useRef<number>(0);
  const currentTranslateX = useRef<number>(0);
  const lastTranslateX = useRef<number>(0);
  const endX = useRef<number>(0);

  const slideDown = (pageX: number, target: HTMLElement) => {
    clickedElement.current = target;
    setIsDragging(true);
    startX.current = pageX;
    endX.current =
      slideBoxRef.current!.clientWidth - slideRef.current!.clientWidth;
  };

  const slideMove = (pageX: number) => {
    if (!isDragging) return;

    const end_X = endX.current;
    let moveX: number = pageX - startX.current;
    let nextTranslateX = lastTranslateX.current + moveX;

    if (nextTranslateX > 0) nextTranslateX = 0 + moveX / 3;
    if (end_X > nextTranslateX) nextTranslateX = end_X + moveX / 3;

    slideRef.current!.style.transform = `translateX(${nextTranslateX}px)`;
    currentTranslateX.current = nextTranslateX;
  };

  const slideUp = useCallback(() => {
    if (!isDragging || !slideBoxRef.current || !slideRef.current) return;

    let scroll = scrollX;
    let finalTranslateX = currentTranslateX.current;
    const slideBoxWidth = slideBoxRef.current.clientWidth;
    const slideWidth = slideRef.current.clientWidth;
    const ImageWidth = slideRef.current?.children[0]?.clientWidth || 0;
    const end_X = endX.current;

    if (finalTranslateX > 0) {
      scroll = (slideBoxWidth / slideWidth) * 100;
      finalTranslateX = 0;
    } else if (finalTranslateX < end_X) {
      finalTranslateX = end_X;
      scroll = 100;
    } else {
      // 스냅 로직: 슬라이드 컨테이너와 가장 가까운 이미지에 맞춤
      let imageIndex = Math.round(finalTranslateX / (ImageWidth + 20));
      finalTranslateX = imageIndex * (ImageWidth + 20);
      scroll = ((Math.abs(finalTranslateX) + slideBoxWidth) / slideWidth) * 100;
      if (finalTranslateX < end_X) finalTranslateX = end_X;
    }

    lastTranslateX.current = finalTranslateX;
    slideRef.current!.style.transform = `translateX(${finalTranslateX}px)`;

    // 인덱스 바 업데이트 로직
    setScrollX(scroll);
    setIsDragging(false);
  }, [isDragging, scrollX]);

  const resizeHandler = useCallback(() => {
    const slideBox = slideBoxRef.current;
    const slide = slideRef.current;
    let finalTranslateX = lastTranslateX.current;
    if (!slideBox || !slide) return;

    // transition을 잠시 비활성화하여 리사이즈 시 어색한 움직임을 방지
    slide.style.transition = "all 0s";

    const boxWidth = slideBox.clientWidth;
    const slideWidth = slide.clientWidth;
    const newEndX = boxWidth - slideWidth;
    let scroll: number = scrollX;

    // Rule 1: 컨테이너가 슬라이드 보다 크면 시작점으로
    if (slideWidth <= boxWidth) {
      if (finalTranslateX === 0) return;
      finalTranslateX = 0;
    } 
    // Rule 2: 슬라이드가 컨테이너 끝 위치까지 좌측으로 이동
    else if (finalTranslateX === 0) scroll = (boxWidth / slideWidth) * 100;
    // Rule 3: 슬라이드가 컨테이너 끝 위치를 벗어난 정도의 좌측 이동
    else if (finalTranslateX <= newEndX) {
      finalTranslateX = newEndX;
      scroll = 100;
    }
    // Rule 4: 슬라이드 끝 위치가 컨테이너 위치보다 뒤에 있을 때 
    else if (finalTranslateX > newEndX) {
      if (scroll === 100) finalTranslateX = newEndX;
      else scroll = ((Math.abs(finalTranslateX) + boxWidth) / slideWidth) * 100;
    }

    lastTranslateX.current = finalTranslateX;
    slide.style.transform = `translateX(${finalTranslateX}px)`;
    setScrollX(scroll);

    // 약간의 딜레이 후 transition 복원
    setTimeout(() => {
      if (slide) slide.style.transition = "all .3s ease-out";
    }, 100);
  }, [lastTranslateX, scrollX]);

  useEffect(() => {
    document.addEventListener("click", slideUp);
    window.addEventListener("resize", resizeHandler);

    return () => {
      document.removeEventListener("click", slideUp);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [slideUp, resizeHandler]);

  useEffect(() => {
    if (!slideBoxRef.current || !slideRef.current) return;

    setScrollX(
      (slideBoxRef.current.clientWidth / slideRef.current.clientWidth) * 100
    );
  }, []);

  return (
    <div className="Theme-Slide-Box" ref={slideBoxRef}>
      <div style={{ display: "flex" }}>
        <div
          className="Theme-Slide"
          onMouseDown={(e) => slideDown(e.pageX, e.target as HTMLElement)}
          onMouseMove={(e) => slideMove(e.pageX)}
          onMouseUp={slideUp}
          onTouchStart={(e) =>
            slideDown(e.targetTouches[0].pageX, e.target as HTMLElement)
          }
          onTouchMove={(e) => slideMove(e.targetTouches[0].pageX)}
          onTouchEnd={slideUp}
          style={{
            transition: "all .1s ease-out",
          }}
          ref={slideRef}
        >
          {images.map((item, idx) => (
            <div key={idx}>
              <img
                src={`./images/theme/${themeObject[theme_number!]}/${item}`}
                alt="item"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="Theme-Slide-Index-Bar" style={{ width: `${scrollX}%` }} />
    </div>
  );
};

export default ThemeSlide;
