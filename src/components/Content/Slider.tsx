import { useState, useRef, useEffect } from "react";
import { ResponImage } from "../../modules/Type";
import NoImage from "../../Images/NoImage.png";
import "./Slider.css";
import SliderButton from "./SliderButton";

interface SliderProps {
  contentImage: ResponImage;
}

const Slider = ({ contentImage }: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(0);


  const imageData = contentImage.response.body.items.item;
  const [currentIndex, setCurrentIndex] = useState<number>(imageData.length);
  const image = [...imageData, ...imageData, ...imageData];
  console.log(currentIndex);

  useEffect(() => {
    // 첫 렌더링시에 width값 업데이트를 위함.
    console.log("마운트 이펙트");
    setWidth(containerRef.current!.clientWidth / 3);
  }, []);


  useEffect(() => {
    // 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절
    const resizeHandler = () => {
      setWidth(containerRef.current!.clientWidth / 3);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });

  console.log(currentIndex);
  return (
    <div className="slider-container">
      <div className="slider-box" ref={containerRef}>
        <div
          className="slider"
          ref={sliderRef}
          style={{
            transform: `translateX(${-width * currentIndex}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {image ? (
            image.map((item, index) => (
              <div
                key={index}
                className="slide"
                style={{ width: `${width}px` }}
              >
                <a key={item.originimgurl} href={item.originimgurl}>
                  <img src={item.originimgurl} alt="축제 사진"></img>
                </a>
              </div>
            ))
          ) : (
            <div className="slider">
              <a>
                <img src={NoImage} alt="축제 이미지"></img>
              </a>
            </div>
          )}
        </div>
        <SliderButton
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          sliderRef={sliderRef}
          imageData={imageData}
        />
      </div>
    </div>
  );
};

export default Slider;

// useEffect(() => {
//   console.log(sliderRef);
//   if (currentIndex === imageData.length) {
//     console.log(`useEFfeect current ${currentIndex}`);
//     setTimeout(() => {
//       console.log("트랜스폼 부여");
//       sliderRef.current!.style.transition = "transform 400ms ease";
//     }, 0);
//   }
// }, [currentIndex, imageData]);
