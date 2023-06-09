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
  imageRef: React.RefObject<HTMLDivElement>;
  type: string;
  contentId: string;
}

const Slider = ({ imageRef, type, contentId }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [image, setImage] = useState<ContentImage[] | ImageData[]>([]);
  const [imageLength, setImageLength] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(2);
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
          setImageLength(1);
        } else {
          /* 해당 축제의 이미지가 있을 때, */
          const img = imageData.response.body.items.item;

          /* 대신 해당 축제의 이미자가 1개만 있을 경우 */
          if (img.length === 1) {
            const arr = [...img, ...img, ...img];
            setImageLength(3);
            setImage([...arr, ...arr, ...arr]);
          }

          /* 해당 축제의 이미지가 2개만 있는 경우*/
          if (1 < img.length && img.length < 4) {
            setImageLength(img.length);
            setImage([...img, ...img, ...img]);
          }

          /* 4개 이상인 경우*/
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
        setWidth(imageRef.current!.clientWidth / 3);
      } catch (error) {
        console.log(error);
      }
    };
    getImage(contentId);
  }, [type, contentId, imageRef]);

  /* 사용자가 브라우저 창 크기를 조절할 때, 그에 따른 slider이미지 크기 조절 */
  useEffect(() => {
    // 첫 렌더링 후 모바일 너비이면 이미지 슬라이드 너비 맞춤
    if (window.innerWidth < 900) setWidth(imageRef.current!.clientWidth);

    // pc 사용자가 브라우저 크기를 조절할 때,
    const resizeHandler = () => {
      setWidth(
        window.innerWidth < 900
          ? imageRef.current!.clientWidth
          : imageRef.current!.clientWidth / 3
      );
    };
    window.addEventListener("resize", resizeHandler);
    // console.log('size effect')
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [imageRef]);

  return (
    <div className="slider-container">
      <div
        className="slider-box"
        ref={imageRef}
        onMouseEnter={() => setISMouseOver(true)}
        onMouseLeave={() => setISMouseOver(false)}
      >
        {image.length === 0 && <Loading />}
        <div
          className="slider"
          ref={sliderRef}
          style={{
            transform: `translateX(${-width * currentIndex}px)`,
            transition: "transform 250ms ease",
          }}
        >
          
          {image.length !== 1 ? (
            image.map((item, index) => (
              <div
                key={index}
                className="slide"
                style={{ width: `${width}px` }}
              >
                <a
                  key={index}
                  href={item.originimgurl.replace("http", "https")}
                >
                  <img
                    src={item.originimgurl.replace("http", "https")}
                    alt="축제 사진"
                  />
                </a>
              </div>
            ))
          ) : (
            <div className="Noimage">
              <img src="/images/NoImage.png" alt="축제 이미지"></img>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* 
          <div className="Noimage">
            <img src="/images/NoImage.png" alt="축제 이미지"></img>
          </div>

        {image.length !== 1 && (
          <SliderButton
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            sliderRef={sliderRef}
            imageLength={imageLength}
            isMouseOver={isMouseOver}
          />
        )} */
}

export default Slider;

const serviceKey = encodeURIComponent(process.env.REACT_APP_SERVICE_KEY!);

async function getContentImage(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponImage = await response.json();
  // console.log(`image ${data}`);
  return data;
}
