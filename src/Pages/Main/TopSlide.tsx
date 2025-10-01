import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopSlide.css";

const top = [
  {
    title: "울산 바위",
    text: "태백산맥의 기운을 품은 채 신비로운 전설과 장엄한 풍광",
    url: "./images/top/ulsanstone.jpg",
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

const SLIDE_DURATION = 8000; // 8 seconds

const CaretLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 192 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M192 127.338v257.324c0 17.818-21.543 26.727-34.142 14.142L29.142 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.716-128.716c12.599-12.599 34.142-3.676 34.142 14.142z" />
  </svg>
);

const CaretRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 192 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M0 384.662V127.338c0-17.818 21.543-26.727 34.142-14.142l128.716 128.716c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.389 0 402.48 0 384.662z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
  </svg>
);

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
  </svg>
);

const TopSlide = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % top.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(handleNext, SLIDE_DURATION);

    return () => clearInterval(intervalId);
  }, [isPaused, handleNext]);

  const prevButtonHandler = () => {
    if (!isPaused) setIsPaused(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + top.length) % top.length);
  };

  const nextButtonHandler = () => {
    if (!isPaused) setIsPaused(true);
    handleNext();
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const activeItem = top[currentIndex];

  return (
    <section className="top-slide-container">
      <div className="slide-background-wrapper">
        {top.map((item, index) => (
          <div
            key={index}
            className={`slide-background ${
              index === currentIndex ? "active" : ""
            }`}
            style={{ backgroundImage: `url(${item.url})` }}
          />
        ))}
      </div>

      <div className="source">
        <span>{activeItem.source}</span>
      </div>

      <div className="slide-ui-container">
        <div className="top-text-box" key={currentIndex}>
          <h2>{activeItem.title}</h2>
          <p>{activeItem.text}</p>
          <Link
            to={`/content?contetTypeId=${activeItem.type}&contentId=${activeItem.contentId}`}
          >
            자세히 보기
          </Link>
        </div>
        <div className="slide-controls">
          <div className="top-slide-page">
            <span>{`${currentIndex + 1} / ${top.length}`}</span>
          </div>
          <div className="time-and-buttons">
            <div className="time-bar-container">
              <div
                className={`time-bar ${!isPaused ? "running" : ""}`}
                key={`${currentIndex}-${isPaused}`}
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
              />
            </div>
            <div className="buttons">
              <button onClick={prevButtonHandler} aria-label="Previous slide">
                <CaretLeftIcon />
              </button>
              <button
                onClick={togglePause}
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
              </button>
              <button onClick={nextButtonHandler} aria-label="Next slide">
                <CaretRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSlide;
