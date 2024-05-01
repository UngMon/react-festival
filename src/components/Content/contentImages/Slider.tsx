import { useState, useRef, useEffect } from "react";
import {
  ContentImage,
  ResponImage,
  ImageData,
} from "../../../type/FestivalType";
import SliderButton from "./SliderButton";
import Loading from "../../loading/Loading";
import "./Slider.css";

interface SliderProps {
  type: string;
  contentId: string;
}

const Slider = ({ type, contentId }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>(0);
  const [image, setImage] = useState<ContentImage[] | ImageData[]>([]);
  const [noImage, setNoImage] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isMouseOver, setISMouseOver] = useState<boolean>(false);

  useEffect(() => {
    const getImage = async (contentId: string) => {
      try {
        const imageData = await getContentImage(contentId);

        /* 한구관광공사에서 받아온 데이터에서 어떤 축제는 이미지가 여러개 있고, 어떤건
        아예 없는 경우가 있다. 각각의 경우에 따라서 image State를 따로 정의해줘야 한다. */

        if (!imageData.response.body.items) {
          /* 관광공사 api로 부터 밭은 데이터에서 해당 축제의 사진이 없을 경우 */
          const object = {
            originimgurl: "/images/NoImage.png",
          };

          setImage([object]);
          setNoImage(true);
          sliderBoxRef.current!.style.justifyContent = "center";
        } else {
          /* 해당 축제의 이미지가 있을 때, */
          const img = imageData.response.body.items.item;

          /* 컨텐츠 이미지 개수에 따른 img 설정 */
          if (img.length === 1) {
            setImage([...img]);
            setWidth(sliderBoxRef.current!.clientWidth);
          } else if (img.length === 2) {
            setImage([...img, ...img, ...img]);
            setWidth(sliderBoxRef.current!.clientWidth / 3);
          } else {
            setImage([img[img.length - 1], ...img, img[0]]);
            setWidth(sliderBoxRef.current!.clientWidth / 3);
          }

          sliderBoxRef.current!.style.justifyContent = "";
        }
        /* 마운트 이후 첫 렌더링에 width값 업데이트를 함. */
      } catch (error) {
        const object = {
          originimgurl: "/images/NoImage.png",
        };

        setImage([object]);
        sliderBoxRef.current!.style.justifyContent = "center";
      }
    };
    getImage(contentId);
  }, [type, contentId, sliderBoxRef]);

  /* 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절 */
  useEffect(() => {
    // 첫 렌더링 후 모바일 너비이면 이미지 슬라이드 너비 맞춤
    if (window.innerWidth < 900) setWidth(sliderBoxRef.current!.clientWidth);

    // pc 사용자가 브라우저 크기를 조절할 때,
    const resizeHandler = () => {
      setWidth(
        window.innerWidth < 900
          ? sliderBoxRef.current!.clientWidth
          : sliderBoxRef.current!.clientWidth / 3
      );
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [sliderBoxRef]);

  return (
    <div className="slider-container">
      <div
        className="slider-box"
        ref={sliderBoxRef}
        onMouseEnter={() => setISMouseOver(true)}
        onMouseLeave={() => setISMouseOver(false)}
      >
        {image.length === 0 && <Loading />}
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
                href={
                  noImage
                    ? "/images/NoImage.png"
                    : item.originimgurl.replace("http", "https")
                }
                rel="noreferrer"
                target="_blank"
              >
                <img
                  src={
                    noImage
                      ? "/images/NoImage.png"
                      : item.originimgurl.replace("http", "https")
                  }
                  alt="축제 사진"
                  loading="lazy"
                  style={{ width: noImage ? "400px" : `${width}px` }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* {image.length !== 1 && (
        <SliderButton
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          sliderRef={sliderRef}
          imageLength={image.length}
          isMouseOver={isMouseOver}
        />
      )} */}
    </div>
  );
};

export default Slider;

const serviceKey = encodeURIComponent(process.env.REACT_APP_DATA_SERVICE_KEY!);

async function getContentImage(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponImage = await response.json();
  console.log(data);
  return data;
}
