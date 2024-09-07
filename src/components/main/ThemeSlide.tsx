import { useEffect, useRef, useState } from "react";
import "./ThemeSlide.css";

interface T {
  images: string[];
  index: number;
  slideBoxRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  theme_number: string | null;
}

const themeObject: { [key: string]: string } = {
  "0": "cafe",
  "1": "culture",
};

const ThemeSlide = ({ images, index, slideBoxRef, theme_number }: T) => {
  const [mouse, setMouse] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>(1000);
  const [startX, setStartX] = useState<number>(0);
  const [cordinateX, setCordinateX] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        idx === index &&
        !slideBoxRef.current[index]?.contains(e.target as Node)
      ) {
        slideUp();
      }
    };

    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  });

  const slideDown = (pageX: number) => {
    setMouse(true);
    setStartX(pageX);
    setCordinateX(distance);
    setIdx(index);
  };

  const slideMove = (pageX: number) => {
    if (!mouse) return;

    let movingX: number = startX - pageX;
    let endX =
      slideRef.current!.clientWidth - slideBoxRef.current[index]!.clientWidth;

    if (cordinateX + movingX < 0) {
      movingX = -cordinateX + (movingX + cordinateX) / 3;
    }

    if (cordinateX + movingX > endX) {
      movingX = endX - cordinateX + (cordinateX + movingX - endX) / 3;
    }

    setDistance(cordinateX + movingX);
  };

  const slideUp = () => {
    let endX =
      slideRef.current!.clientWidth - slideBoxRef.current[index]!.clientWidth;
    let count = Math.round(distance / imageRef.current!.clientWidth);
    setMouse(false);
    if (distance < 0) {
      setDistance(0);
    } else if (distance > endX) {
      setDistance(endX);
      count = images.length - 1;
    } else {
      setDistance(count * imageRef.current!.clientWidth + 20 * count);
    }
    setCount(count);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        className="Theme-Slide"
        onMouseDown={(e) => slideDown(e.pageX)}
        onMouseMove={(e) => slideMove(e.pageX)}
        onMouseUp={slideUp}
        onTouchStart={(e) => slideDown(e.targetTouches[0].pageX)}
        onTouchMove={(e) => slideMove(e.targetTouches[0].pageX)}
        onTouchEnd={slideUp}
        style={{
          transition: "all .1s ease",
          transform: `translateX(${-distance}px)`,
        }}
        ref={slideRef}
      >
        {images.map((item, idx) => (
          <div key={idx} className="d">
            <img
              src={`./images/theme/${themeObject[theme_number!]}/${item}`}
              alt="item"
              ref={imageRef}
            />
          </div>
        ))}
      </div>
      <div className="Theme-Slide-Index-Bar">
        {images.map((_, idx) => (
          <div
            key={idx}
            style={{ width: count === idx ? "15px" : "7px" }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSlide;
