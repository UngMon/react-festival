import { useCallback, useEffect, useRef, useState } from "react";
import "./ThemeSlide.css";

interface T {
  images: string[];
  index: number;
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

const ThemeSlide = ({ images, index, clickedElement, theme_number }: T) => {
  const [mouse, setMouse] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [cordinateX, setCordinateX] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const slideDown = (pageX: number, target: HTMLElement) => {
    clickedElement.current = target;
    setMouse(true);
    setStartX(pageX);
    setCordinateX(distance);
  };

  const slideMove = (pageX: number) => {
    if (!mouse) return;

    let movingX: number = startX - pageX;
    let endX = slideRef.current!.clientWidth - slideBoxRef.current!.clientWidth;
    if (cordinateX + movingX < 0) {
      movingX = -cordinateX + (movingX + cordinateX) / 3;
    }

    if (cordinateX + movingX > endX) {
      movingX = endX - cordinateX + (cordinateX + movingX - endX) / 3;
    }

    setDistance(cordinateX + movingX);
  };

  const slideUp = useCallback(() => {
    if (!slideBoxRef.current?.contains(clickedElement.current)) return;

    const endX =
      slideRef.current!.clientWidth - slideBoxRef.current!.clientWidth;
    let count = Math.round(distance / imageRef.current!.clientWidth);
    let distant;
    setMouse(false);

    if (distance < 0) {
      distant = 0;
    } else if (distance > endX || distance === endX) {
      // console.log("Distance > endX");
      distant = endX;
      count = images.length;
    } else {
      // console.log("Distance <= endX");
      // console.log(distance, endX);
      distant = count * imageRef.current!.clientWidth + 20 * count;
    }

    setDistance(distant);
    setCount(Math.floor(5 * (distant / endX)));
  }, [distance, images.length, clickedElement]);

  useEffect(() => {
    const clickHandler = () => {
      slideUp();
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [slideUp, clickedElement, index]);

  return (
    <div className="Theme-Slide-Box" ref={slideBoxRef}>
      <div style={{ display: "flex" }}>
        <div
          className="Theme-Slide"
          onMouseDown={(e) => slideDown(e.pageX, e.target as HTMLElement)}
          onMouseMove={(e) => slideMove(e.pageX)}
          onMouseUp={(e) => slideUp()}
          onTouchStart={(e) =>
            slideDown(e.targetTouches[0].pageX, e.target as HTMLElement)
          }
          onTouchMove={(e) => slideMove(e.targetTouches[0].pageX)}
          onTouchEnd={(e) => slideUp()}
          style={{
            transition: "all .1s ease",
            transform: `translateX(${-distance}px)`,
          }}
          ref={slideRef}
        >
          {images.map((item, idx) => (
            <div key={idx}>
              <img
                src={`./images/theme/${themeObject[theme_number!]}/${item}`}
                alt="item"
                ref={imageRef}
              />
            </div>
          ))}
        </div>
        <div className="Theme-Slide-Index-Bar">
          <div className="bar" style={{ width: `${count * 20}px` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSlide;
