import { useState, useRef, useEffect } from "react";
import { ContentImage, ResponImage, ImageData } from "../../modules/Type";
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

  useEffect(() => {
    /* 한구관광공사에서 받아온 데이터에서 어떤 축제는 이미지가 여러개 있고, 어떤건
      아예 없는 경우가 있다. 각각의 경우에 따라서 image State를 따로 정의해줘야 한다. */

    if (!contentImage.response.body.items) {
      /* 관광공사 api로 부터 밭은 데이터에서 해당 축제의 사진이 없을 경우 */
      const object = {
        originimgurl: "/images/NoImage.png",
      };
      setImageLength(3);
      setImage([object, object, object, object, object, object, object]);
    }

    if (contentImage.response.body.items) {
      /* 해당 축제의 이미지가 있을 때, */
      const img = contentImage.response.body.items.item;

      /* 대신 해당 축제의 이미자가 1개만 있을 경우 */
      if (img.length === 1) {
        const arr = [...img, ...img, ...img];
        setImageLength(3);
        setImage([...arr, ...arr, ...arr]);
      }

      /* 해당 축제의 이미지가 2개만 있는 경우*/
      if (img.length === 2) {
        setImageLength(2);
        setImage([...img, ...img, ...img]);
      }

      /* 3개만 있는 경우*/
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
      /* 마운트 이후 첫 렌더링에 width값 업데이트를 함. */
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
