import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainTop, trend } from "../../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./Main.css";

const Main = () => {
  const navigate = useNavigate();

  const [width, setWidth] = useState<number>(0);
  const [count, setCount] = useState<number>(1);
  const [startX, setStartX] = useState<number>(0);
  const [clickX, setClclickX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [delay, setDelay] = useState<boolean>(false);

  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const sliderOneRef = useRef<HTMLDivElement>(null);
  const sliderTwoRef = useRef<HTMLDivElement>(null);

  const clickHandler = (type: string, contentId: string) => {
    navigate(`/content/search?type=${type}&contentId=${contentId}`);
  };

  const mouseDown = (e: any, type: string) => {
    e.preventDefault();
    let pageX;
    if (type === "p") pageX = e.pageX;
    if (type === "m") pageX = e.touches[0].pageX;
    setIsDragging(true);
    setClclickX(pageX);
    setStartX(pageX + scrollLeft);
  };

  const mouseMove = (e: any, type: string) => {
    // console.log("move");
    if (!isDragging) {
      // console.log('???????')
      if (scrollLeft < 0) {
        setScrollLeft(0);
      } else if (scrollLeft > 1275) {
        setScrollLeft(1275);
      }
      return;
    }

    let pageX = type === "p" ? e.pageX : e.touches[0].pageX;

    // console.log(`e.pageX ${pageX}`);
    // console.log(`startX ${startX}`);
    // console.log(`scroll ${scrollLeft}`);

    setScrollLeft(startX - pageX);
    setStartX(pageX + scrollLeft);
  };

  const mouseUp = () => {
    console.log("mouseup");
    setIsDragging(false);
  };

  useEffect(() => {
    const resizeHandler = () => {
      setWidth(sliderBoxRef.current!.clientWidth);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let time = 3000;
    console.log(`effect ${count}`);
    if (width === 0) {
      setWidth(sliderBoxRef.current!.clientWidth);
    }

    if (count === 1 || count === mainTop.length - 2) {
      if (!sliderOneRef.current!.style.transition) time = 2500;
      setTimeout(() => {
        sliderOneRef.current!.style.transition = "transform 500ms ease";
      }, 100);
    }

    if (stop) return;

    timer = setTimeout(() => {
      console.log("setTime working");
      setCount(count + 1);
      if (time !== 3000) time = 3000;
      sliderOneRef.current!.style.transition = "transform 500ms ease";
      if (count === mainTop.length - 2) {
        setTimeout(() => {
          sliderOneRef.current!.style.transition = "";
          setCount(1);
        }, 500);
      }
    }, time);

    return () => {
      clearTimeout(timer);
    };
  }, [sliderBoxRef, count, width, stop]);

  useEffect(() => {
    if (!isDragging) {
      console.log("???????");
      if (scrollLeft < 0) {
        setScrollLeft(0);
      } else if (scrollLeft > 1275) {
        setScrollLeft(1275);
      }
      return;
    }
  }, [isDragging, scrollLeft]);

  const topSlidebuttonHandler = (type: string) => {
    console.log(`count button ${count}`);
    if (delay) return;

    if (type === "prev") {
      setCount(count - 1);
      if (count === 1)
        setTimeout(() => {
          setCount(mainTop.length - 2);
          sliderOneRef.current!.style.transition = "";
        }, 500);
    }

    if (type === "next") {
      setCount(count + 1);
      if (count === mainTop.length - 2)
        setTimeout(() => {
          setCount(1);
          sliderOneRef.current!.style.transition = "";
        }, 500);
    }

    !stop && setStop(true);
    setDelay(true);
    setTimeout(() => {
      setDelay(false);
    }, 1000);
  };

  const handler = (e: React.MouseEvent, type: string) => {
    clickX === e.pageX && navigate(`/trend/search?type=${type}`);
  };

  const trendButton = (type: string) => {
    if (scrollLeft > 1275 || scrollLeft < 0) return;
    setScrollLeft(type === "prev" ? scrollLeft - 255 : scrollLeft + 255);
  };

  return (
    <main className="main-page">
      <div className="top-box">
        <h2 className="top-title">6월은 호국 보훈의 달</h2>
        <div className="top-slide-box" ref={sliderBoxRef}>
          <div
            className="top-slider"
            ref={sliderOneRef}
            style={{
              transform: `translateX(${-width * count}px)`,
              transition: "transform 500ms ease",
            }}
          >
            {mainTop.map((item, index) => (
              <div
                key={index}
                className="top-slide-item"
                style={{ width: width }}
                onClick={() => clickHandler(item.type, item.contentId)}
              >
                <img src={item.img} alt="img"></img>
                <div className="top-slide-item-text">
                  <p className="m-slide-title">{item.title}</p>
                  <p className="m-slide-intro">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="top-slider-ui">
          <div className="timer-bar">
            <span className="t-bar">
              <span className={`${!stop ? "timer" : ""}`}></span>
            </span>
          </div>
          <div className="top-count">
            <span>
              {count === 0 ? 7 : count === mainTop.length - 1 ? 1 : count}
            </span>
            <span>of</span>
            <span>{mainTop.length - 2}</span>
          </div>
          <div className="top-slider-button">
            <button onClick={() => topSlidebuttonHandler("prev")}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button onClick={() => setStop(!stop)}>
              {!stop && <FontAwesomeIcon icon={faPause} />}
              {stop && <FontAwesomeIcon icon={faPlay} />}
            </button>
            <button onClick={() => topSlidebuttonHandler("next")}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="theme-container">
        <h3 className="trend-title">관광 트렌드</h3>
        <div
          className="theme-box"
          ref={sliderTwoRef}
          onMouseDown={(e) => mouseDown(e, "p")}
          onMouseMove={(e) => mouseMove(e, "p")}
          onMouseUp={mouseUp}
          onMouseLeave={mouseUp}
          onTouchStart={(e) => mouseDown(e, "m")}
          onTouchMove={(e) => mouseMove(e, "m")}
          onTouchEnd={mouseUp}
        >
          <div
            className="theme"
            style={{ transform: `translateX(${-scrollLeft}px)` }}
          >
            {trend.map((item, index) => (
              <div
                key={index}
                className="theme-item"
                onClick={(e) => handler(e, item.type)}
              >
                <div className="th-img">
                  <img src={item.url} alt="img" />
                </div>
                <h4>{item.title}</h4>
              </div>
            ))}
          </div>
          <button
            id="left"
            onClick={() => trendButton("prev")}
            disabled={scrollLeft <= 0 ? true : false}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            id="right"
            onClick={() => trendButton("next")}
            disabled={scrollLeft >= 1275 ? true : false}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Main;
