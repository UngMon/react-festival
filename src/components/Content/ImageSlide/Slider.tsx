import { useState, useRef, useEffect } from "react";
import { ContentImage, ResponImage } from "@/type/ContentType";
import SliderButton from "./SliderButton";
import Loading from "@/components/Loading/Loading";
import "./Slider.css";

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

async function getContentImage(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponImage = await response.json();
  return data;
}

interface SliderProps {
  content_id: string;
}

const Slider = ({ content_id }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [image, setImage] = useState<ContentImage[]>([]);
  const [originImages, setOriginImages] = useState<ContentImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisibleButton, setIsVisibleButton] = useState<boolean>(true);

  useEffect(() => {
    const getImage = async (contentId: string) => {
      try {
        const imageData = await getContentImage(contentId);
        /* 각 콘텐츠는 상세 이미지가 여러개 있고, 어떤 콘텐츠는 이미지가 없는 경우가 있다.
        상황에 맞게 image State를 따로 정의해야 한다. */

        let img = imageData.response.body.items.item ?? [
          { originimgurl: "/images/NoImage.png" },
        ];

        setOriginImages(img);

        if (img.length === 1) {
          setImage(img);
          sliderBoxRef.current!.style.justifyContent = "center";
        } else if (img.length === 2) {
          setImage(img);
          setWidth(sliderBoxRef.current!.clientWidth / 2);
          setCurrentIndex(0);
        } else {
          setImage([...img, ...img, ...img]);
          setWidth(sliderBoxRef.current!.clientWidth / 3);
          setCurrentIndex(img.length);
        }

        /* 마운트 이후 첫 렌더링에 width값 업데이트를 함. */
      } catch (error) {
        const object = {
          originimgurl: "/images/NoImage.png",
        };
        setImage([object]);
        setOriginImages([object]);
        sliderBoxRef.current!.style.justifyContent = "center";
      }
    };
    getImage(content_id);
  }, [content_id, sliderBoxRef]);

  /* 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절 */
  useEffect(() => {
    // 첫 렌더링 후 모바일 너비이면 이미지 슬라이드 너비 맞춤
    if (window.innerWidth <= 850) {
      if (image.length === 2) {
        if (window.innerWidth <= 590) {
          setWidth(sliderBoxRef.current!.clientWidth);
          setIsVisibleButton(true);
        } else {
          setWidth(sliderBoxRef.current!.clientWidth / 2);
          setIsVisibleButton(false);
        }
      }

      if (image.length > 2) {
        if (window.innerWidth > 850)
          setWidth(sliderBoxRef.current!.clientWidth / 3);
        else setWidth(sliderBoxRef.current!.clientWidth);
      }
    }

    // pc 사용자가 브라우저 크기를 조절할 때,
    const resizeHandler = () => {
      if (image.length === 2) {
        if (window.innerWidth <= 590) {
          setWidth(sliderBoxRef.current!.clientWidth);
          setIsVisibleButton(true);
        } else {
          setWidth(sliderBoxRef.current!.clientWidth / 2);
          setIsVisibleButton(false);
        }
      } else if (image.length > 2) {
        setWidth(
          window.innerWidth > 850
            ? sliderBoxRef.current!.clientWidth / 3
            : sliderBoxRef.current!.clientWidth
        );
      }
    };
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [sliderBoxRef, image]);

  return (
    <div className="slider-container">
      <div className="slider-box" ref={sliderBoxRef}>
        {image.length === 0 && <Loading height="400px"/>}
        <div
          className="slider"
          ref={sliderRef}
          style={{
            transform:
              image.length === 1
                ? ""
                : `translateX(${-width * currentIndex}px)`,
            transition: "transform 250ms ease",
          }}
        >
          {image.map((item, index) => (
            <div key={index} className="slide">
              <a
                key={index}
                href={item.originimgurl.replace("http", "https")}
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={item.originimgurl.replace("http", "https")}
                  alt="축제 사진"
                  loading="lazy"
                  style={{ width: image.length < 2 ? "300px" : `${width}px` }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="content-image-index">
        {originImages.map((_, index) => (
          <div
            key={index}
            style={{
              width:
                currentIndex % originImages.length === index ? "14px" : "7px",
              backgroundColor:
                currentIndex % originImages.length === index
                  ? "rgb(131, 131, 131)"
                  : "rgb(168, 168, 168)",
            }}
          />
        ))}
      </div>
      {image.length > 1 && isVisibleButton && (
        <SliderButton
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          sliderRef={sliderRef}
          imageLength={image.length}
        />
      )}
    </div>
  );
};

export default Slider;
