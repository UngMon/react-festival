import { useState, useRef, useEffect } from "react";
import { ContentImage, ResponImage, ImageData } from "../../modules/Type";
// import NoImage from "../../Images/NoImage.png";
import "./Slider.css";
import SliderButton from "./SliderButton";

interface SliderProps {
  contentImage: ResponImage;
}

const Slider = ({ contentImage }: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [image, setImage] = useState<ContentImage[] | ImageData[]>([]);
  const [imageLength, setImageLength] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(2);
  const [isMouseOver, setISMouseOver] = useState<boolean>(false);

  /* 첫 렌더링시에 width값 업데이트를 함. */
  useEffect(() => {
    console.log("?????");
    if (!contentImage.response.body.items) {
      /* 관광공사 api로 부터 밭은 데이터에서 해당 축제의 사진이 없을 경우 */
      const object = {
        originimgurl: "/images/NoImage.png",
      };
      setImageLength(3);
      setImage([object, object, object, object, object, object, object]);
    }

    if (contentImage.response.body.items) {
      const img = contentImage.response.body.items.item;

      if (img.length === 1) {
        const arr = [...img, ...img, ...img];
        setImageLength(3);
        setImage([...arr, ...arr, ...arr]);
      }

      if (img.length === 2) {
        setImageLength(2);
        setImage([...img, ...img, ...img]);
      }

      if (img.length === 3) {
        setImageLength(3);
        setImage([...img, ...img, ...img]);
      }

      if (img.length > 3) {
        setImageLength(img.length);
        setImage([
          img[img.length - 2],
          img[img.length - 1],
          ...img,
          img[0],
          img[1],
        ]);
      }
    }

    setWidth(containerRef.current!.clientWidth / 3);
  }, [contentImage]);

  /* 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절 */
  useEffect(() => {
    const resizeHandler = () => {
      setWidth(
        containerRef.current!.clientWidth < 650
          ? containerRef.current!.clientWidth
          : containerRef.current!.clientWidth / 3
      );
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });

  /* 아래 두 함수는 마우스가 sluder-container에 있으면 SliderButton.tsx에서
   정의한 자동 슬라이드 기능을 멈추게 해줌. */
  const mouseEnterHandler = () => {
    setISMouseOver(true);
  };

  const mouseLeaveHandler = () => {
    setISMouseOver(false);
  };

  return (
    <div
      className="slider-container"
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="slider-box" ref={containerRef}>
        <div
          className="slider"
          ref={sliderRef}
          style={{
            transform: `translateX(${-width * currentIndex}px)`,
            transition: "transform 250ms ease",
          }}
        >
          {image ? (
            image.map((item, index) => (
              <div
                key={index}
                className="slide"
                style={{ width: `${width}px` }}
              >
                <a key={index} href={item.originimgurl}>
                  <img src={item.originimgurl} alt="축제 사진"></img>
                </a>
              </div>
            ))
          ) : (
            <div className="slider">
              <a href="/Noimage.png">
                <img alt="축제 이미지"></img>
              </a>
            </div>
          )}
        </div>
        <SliderButton
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          sliderRef={sliderRef}
          imageLength={imageLength}
          isMouseOver={isMouseOver}
        />
      </div>
    </div>
  );
};

export default Slider;
