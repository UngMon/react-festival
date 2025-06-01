import { useState, useRef, useEffect, useCallback } from "react";
import { ContentImage, ResponImage } from "type/ContentType";
import SliderButton from "./SliderButton";
import Loading from "components/Loading/Loading";
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
  console.log("Slider");
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [image, setImage] = useState<ContentImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [originImages, setOriginImages] = useState<ContentImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisibleButton, setIsVisibleButton] = useState<boolean>(true);

  useEffect(() => {
    const getImage = async (contentId: string) => {
      const box = sliderBoxRef.current;
      if (!box) return;

      const noImageObj = { originimgurl: "/images/NoImage.png" };

      try {
        const imageData = await getContentImage(contentId);
        /* 각 콘텐츠는 상세 이미지가 여러개 있고, 어떤 콘텐츠는 이미지가 없는 경우가 있다.
        상황에 맞게 image State를 따로 정의해야 한다. */

        let img = imageData.response.body.items.item ?? [noImageObj];

        setOriginImages(img);

        if (img.length === 1) {
          setImage(img);
          box.style.justifyContent = "center";
          return;
        }

        if (img.length === 2) {
          setImage(img);
          setWidth(box.clientWidth / 2);
          return;
        }

        setImage([...img, ...img, ...img]);
        setWidth(box.clientWidth / 3);
        setCurrentIndex(img.length);

        /* 마운트 이후 첫 렌더링에 width값 업데이트를 함. */
      } catch (error) {
        setImage([noImageObj]);
        setOriginImages([noImageObj]);
        box.style.justifyContent = "center";
      }
    };
  
    async function fetchData() {
        await getImage(content_id);
        setIsLoading(false);
    };

    fetchData();
  }, [content_id]);

  const fitImageSize = useCallback(() => {
    // 마운트 후 사용자 환경에 따른 이미지 너비 맞춤
    const box = sliderBoxRef.current;
    if (!box) return;

    if (window.innerWidth <= 850) {
      if (image.length === 2) {
        if (window.innerWidth <= 590) {
          setWidth(box.clientWidth);
          setIsVisibleButton(true);
        } else {
          setWidth(box.clientWidth / 2);
          setIsVisibleButton(false);
        }
      }

      if (image.length > 2) setWidth(sliderBoxRef.current!.clientWidth);
    }
  }, [image]);

  const resizeHandler = useCallback(() => {
    // pc 사용자가 브라우저 크기를 조절할 때,
    if (window.innerWidth > 850) return;

    const box = sliderBoxRef.current;
    if (!box) return;

    if (image.length === 2) {
      if (window.innerWidth <= 590) {
        setWidth(box.clientWidth);
        setIsVisibleButton(true);
      } else {
        setWidth(box.clientWidth / 2);
        setIsVisibleButton(false);
      }
      return;
    }

    if (image.length > 2)
      setWidth(window.innerWidth > 850 ? box.clientWidth / 3 : box.clientWidth);
  }, [image]);

  /* 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절 */
  useEffect(() => {
    fitImageSize();

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeHandler, fitImageSize]);

  return (
    <div className="slider-container">
      <div className="slider-box" ref={sliderBoxRef}>
        {isLoading && <Loading height="400px" />}
        <div
          className="slider"
          ref={sliderRef}
          style={{
            transform:
              image.length === 1
                ? ""
                : `translateX(${-width * currentIndex}px)`,
          }}
        >
          {image.map((item, index) => (
            <div key={item.originimgurl + index} className="slide">
              <a
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
                  ? "rgb(84, 84, 84)"
                  : "rgb(187, 187, 187)",
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
