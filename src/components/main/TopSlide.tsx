import { useEffect, useRef, useState } from "react";
import {
  faCaretLeft,
  faCaretRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./TopSlide.css";

const top = [
  {
    title: "렛츠런파크 서울 벚꽃축제",
    text: "‘나만 알고 싶은’ 숨은 벚꽃 명소 렛츠런파크, 야갼경마와 함께 벚꽃야경을 즐길 수 있는 특별한 축제",
    url: "./images/test/letsrun.webp",
    source: "ⓒYoutube seoul_4k",
  },
  {
    title: "낙동강유채축제",
    text: "'자연과 사람의 만남' 나비와 벌이 꽃처럼 가득한 낙동강유채단지의 아름다움",
    url: "./images/test/nakdong.webp",
    source: "ⓒ한국관광공사 사진갤러리-홍길동",
  },
  {
    title: "팜월드",
    text: "'대자연 속에서 보내는 하루', 다양한 체험을 즐길 수 있는 안성 팜랜드의 유채꽃밭",
    url: "./images/test/farmworld.webp",
    source: "ⓒ한국관광공사 사진갤러리-권기대",
  },
  {
    title: "고창 읍성",
    text: "읍성의 봄은 아름답다",
    url: "./images/test/gochang.webp",
    source: "ⓒ한국관광공사 사진갤러리-신원철",
  },
  {
    title: "태안 세계튤립꽃박람회",
    text: "코리아플라워파크에서 펼쳐지는 태안 세계튤립꽃박람회",
    url: "./images/test/tean.webp",
    source: "ⓒYoutube Vagabond Jose",
  },
];

const TopSlide = () => {
  const [count, setCount] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);
  const imageRef = useRef<Array<HTMLDivElement | null>>([]);
  const timeBarRef = useRef<HTMLDivElement>(null);
  console.log(`Rendering count = ${count}`);

  useEffect(() => {
    if (stop) return;

    const timeId = setTimeout(() => {
      timeBarRef.current!.className = "time-bar slide-active";
    }, 100);

    let nextIndex: number = count < top.length - 1 ? count + 1 : 0;
    const currentImageRef = imageRef.current[count];
    const nextImageRef = imageRef.current[nextIndex];

    if (currentImageRef && nextImageRef) {
      currentImageRef.style.opacity = "0";
      currentImageRef.style.transition = "opacity 3s ease-in-out 5s";
      currentImageRef.style.zIndex = "1";

      nextImageRef.style.opacity = "1";
      nextImageRef.style.transition = "";
      nextImageRef.style.zIndex = "0";
    }

    const time = setTimeout(() => {
      setCount(count < top.length - 1 ? count + 1 : 0);
      timeBarRef.current!.className = "time-bar";
    }, 8000);

    return () => {
      clearTimeout(time);
      clearTimeout(timeId);
    };
  }, [count, stop]);

  const sideButtonClickHandler = (type: string) => {
    let time: number = 0;
    if (!stop) {
      pauseClickHandler();
      time = 50;
    }

    const currentImageRef = imageRef.current[count];

    setTimeout(() => {
      if (type === "prev") {
        let prevIndex = count - 1 < 0 ? top.length - 1 : count - 1;
        const prevImageRef = imageRef.current[prevIndex];

        if (currentImageRef && prevImageRef) {
          currentImageRef.style.opacity = "0";
          currentImageRef.style.transition = "opacity 1s ease-in-out";
          currentImageRef.style.zIndex = "1";

          prevImageRef.style.opacity = "1";
          prevImageRef.style.transition = "";
          prevImageRef.style.zIndex = "0";
        }

        setCount(prevIndex);
      } else {
        let nextIndex = count + 1 >= top.length ? 0 : count + 1;
        const nextImageRef = imageRef.current[nextIndex];

        if (currentImageRef && nextImageRef) {
          currentImageRef.style.opacity = "0";
          currentImageRef.style.transition = "opacity 1s ease-in-out";
          currentImageRef.style.zIndex = "1";

          nextImageRef.style.opacity = "1";
          nextImageRef.style.transition = "";
          nextImageRef.style.zIndex = "0";
        }

        setCount(nextIndex);
      }
    }, time);
  };

  const pauseClickHandler = () => {
    let nextIndex: number = count < top.length - 1 ? count + 1 : 0;
    const currentImageRef = imageRef.current[count];
    const nextImageRef = imageRef.current[nextIndex];

    if (!stop) {
      if (currentImageRef && nextImageRef) {
        currentImageRef.style.opacity = "1";
        currentImageRef.style.transition = "";
        nextImageRef.style.opacity = "0";
        nextImageRef.style.transition = "";
        timeBarRef.current!.className = "time-bar";
      }
    }

    setStop(!stop);
  };

  return (
    <section className="top-slide-container">
      {top.map((item, index) => (
        <div
          key={index}
          ref={(el: HTMLDivElement) => (imageRef.current![index] = el)}
          className="top-visual"
          style={{
            opacity: index === 0 ? 1 : 0,
          }}
        >
          <div className="source">{item.source}</div>
          <div className="top-slide-image">
            <img src={item.url} alt={item.title} />
          </div>
          <div className="top-text-box">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <button>더보기</button>
          </div>
        </div>
      ))}
      <div className="slide-time-box">
        <div className="time-bar" ref={timeBarRef}></div>
        <div className="time-button">
          <button
            className="prev"
            onClick={() => sideButtonClickHandler("prev")}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <button className="pause" onClick={pauseClickHandler}>
            {stop ? (
              <FontAwesomeIcon icon={faPlay} />
            ) : (
              <FontAwesomeIcon icon={faPause} />
            )}
          </button>
          <button
            className="next"
            onClick={() => sideButtonClickHandler("next")}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSlide;
