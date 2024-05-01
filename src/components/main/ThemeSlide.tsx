import { useEffect, useRef, useState } from "react";
import "./ThemeSlide.css";

interface T {
  images: string[];
  index: number;
  slideBoxRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const ThemeSlide = ({ images, index, slideBoxRef }: T) => {
  const [mouse, setMouse] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>(1000);
  const [startX, setStartX] = useState<number>(0);
  const [cordinateX, setCordinateX] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (idx === index && !slideBoxRef.current[index]?.contains(e.target as Node)) {
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
    let endX = slideRef.current!.clientWidth - slideBoxRef.current[index]!.clientWidth;

    if (cordinateX + movingX < 0) {
      movingX = -cordinateX + (movingX + cordinateX) / 3;
    }

    if (cordinateX + movingX > endX) {
      movingX = endX - cordinateX + (cordinateX + movingX - endX) / 3;
    }

    setDistance(cordinateX + movingX);
  };

  const slideUp = () => {
    let endX = slideRef.current!.clientWidth - slideBoxRef.current[index]!.clientWidth;

    setMouse(false);
    if (distance < 0) {
      setDistance(0);
    } else if (distance > endX) {
      setDistance(endX);
    } else {
      let count = Math.round(distance / imageRef.current!.clientWidth);
      setDistance(count * imageRef.current!.clientWidth + 20 * count);
    }
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
        {images.map((item, index) => (
          <div key={index} className="d">
            <img
              src={`./images/theme/cafe/${item}`}
              alt="item"
              ref={imageRef}
            />
          </div>
        ))}
      </div>
      <div className="Theme-Slide-Index-Bar" />
    </div>
  );
};

export default ThemeSlide;

// const touchEnd = (pageX: number) => {
//   setMouse(false);
//   const cardWidth = liRef.current!.clientWidth;
//   let newDistance = 0,

//   if (distance < 0) {
//     newDistance = 0;
//   } else if (distance > images.length * cardWidth) {
//     newDistance = (images.length - 1) * cardWidth;
//   } else {
//     let cardIndex: number = 0,
//       fraction: string = (distance / cardWidth)
//         .toFixed(1)
//         .toString()
//         .split(".")[1];

//     if (startX - pageX >= 0) {
//       if (fraction > "2") cardIndex = Math.ceil(distance / cardWidth);
//       else cardIndex = Math.floor(distance / cardWidth);
//     }

//     if (startX - pageX < 0) {
//       if (fraction < "8") cardIndex = Math.floor(distance / cardWidth);
//       else cardIndex = Math.ceil(distance / cardWidth);
//     }

//     newDistance = cardIndex * cardWidth;
//   }

//   setDistance(newDistance);
// };
