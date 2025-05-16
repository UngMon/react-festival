import { useEffect, useRef, useState } from "react";
import {
  faCaretLeft,
  faCaretRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./TopSlide.css";

const top = [
  {
    title: "초곡 용굴 촛대바위길",
    text: "삼척의 시원하고 아늑한 초곡항의 길",
    url: "./images/top/cho.jpg",
    source: "ⓒ한국관광공사 포토코리아-강원지사 모먼트스튜디오",
    type: "28",
    contentId: "2633902",
  },
  {
    title: "삼척 장호항",
    text: "흰 모래사장과 기암괴석으로 둘러싸인 아름다운 해변",
    url: "./images/top/janghohang.jpg",
    source: "ⓒ한국관광공사 포토코리아-허흥무",
    type: "12",
    contentId: "128965",
  },
  {
    title: "월출산",
    text: "멋진 절경을 가진 아름다운 산",
    url: "./images/top/wolchulsan.jpg",
    source: "ⓒ한국관광공사 포토코리아-김한중",
    type: "12",
    contentId: "2759617",
  },
  {
    title: "수주팔봉",
    text: "한 폭의 동양화를 펼처 놓은 듯한 풍경",
    url: "./images/top/sujupalbong.jpg",
    source: "ⓒ한국관광공사 포토코리아-윤진호",
    type: "28",
    contentId: "2761699",
  },
  {
    title: "섭지코지",
    text: "제주도의 아름다운 바다 절경을 감상할 수 있는 곳",
    url: "./images/top/seopjikoji.jpg",
    source: "ⓒ한국관광공사 포토코리아-라이브스튜디오",
    type: "12",
    contentId: "127813",
  },
  {
    title: "코난해변",
    text: "코발트빛보다 더 나은 해변",
    url: "./images/top/konan.jpg",
    source: "ⓒ한국관광공사 포토코리아-한국관광공사 이범수",
    type: "12",
    contentId: "2837222",
  },
  {
    title: "매봉산 바람의 언덕",
    text: "백두대간의 함백산에서 서쪽으로 갈라지는 능선상 최고봉",
    url: "./images/top/maebongsan.jpg",
    source: "ⓒ한국관광공사 포토코리아-서보선",
    type: "12",
    contentId: "127824",
  },
  {
    title: "해운대 블루라인파크",
    text: "해운대 관광특구의 핵심 관광 시설",
    url: "./images/top/blueline.jpg",
    source: "ⓒ한국관광공사 포토코리아-디자인글꼴",
    type: "12",
    contentId: "2672393",
  },
];

const TopSlide = () => {
  const [count, setCount] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);
  const imageRef = useRef<Array<HTMLDivElement | null>>([]);
  const timeBarRef = useRef<HTMLDivElement>(null);

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
      setCount(nextIndex);
      timeBarRef.current!.className = "time-bar";
    }, 8000);

    return () => {
      clearTimeout(time);
      clearTimeout(timeId);
    };
  }, [count, stop]);

  const sideButtonClickHandler = (type: string) => {
    if (!stop) pauseClickHandler();

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
          currentImageRef.style.transition = "opacity 1s ease";
          currentImageRef.style.zIndex = "1";

          nextImageRef.style.opacity = "1";
          nextImageRef.style.transition = "";
          nextImageRef.style.zIndex = "0";
        }

        setCount(nextIndex);
      }
    }, 0);
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
          <div className="source">
            <span>{item.source}</span>
          </div>
          <div className="top-slide-image">
            <img src={item.url} alt={item.title} />
          </div>
          <div className="top-text-box">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <Link
              to={`/content/search?type=${item.type}&contentId=${item.contentId}`}
            >
              자세히 보기
            </Link>
          </div>
          <div className="top-slide-page">
            <span>{`${index + 1} of ${top.length}`}</span>
          </div>
        </div>
      ))}
      <div className="slide-time-box">
        <div className="time-bar" ref={timeBarRef}></div>
        <div className="time-button">
          <button onClick={() => sideButtonClickHandler("prev")}>
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <button onClick={pauseClickHandler}>
            <FontAwesomeIcon icon={stop ? faPlay : faPause} />
          </button>
          <button onClick={() => sideButtonClickHandler("next")}>
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSlide;
