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
  const [distance, setDistance] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [topMoving, setMoving] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [delay, setDelay] = useState<boolean>(false);
  const [thorttled, setThrotteld] = useState<boolean>(false);

  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const sliderOneRef = useRef<HTMLDivElement>(null);
  const sliderTwoRef = useRef<HTMLDivElement>(null);

  const clickHandler = (type: string, contentId: string) => {
    navigate(`/content/search?type=${type}&contentId=${contentId}`);
  };

  const mouseDown = (e: any, type: string) => {
    let pageX;
    if (type === "p") {
      pageX = e.pageX;
      e.preventDefault();
    }
    if (type === "m") pageX = e.touches[0].pageX;
    setIsDragging(true);
    setStartX(pageX);
  };

  const mouseMove = (e: any, type: string) => {
    if (thorttled) return;
    setThrotteld(true);
    let pageX = type === "p" ? e.pageX : e.touches[0].pageX;
    let result = startX - pageX;
    let x = xp;
    if (distance > 1275 || distance < 0) {
      if (distance > 1275) x = 1275;
      if (distance < 0) x = 0;
      result = (startX - pageX) / 2;
    }

    setDistance(x + result);
    setTimeout(() => {
      setThrotteld(false);
    }, 100);
  };

  const mouseUp = (e: any, type: string) => {
    let pageX;
    if (type === "p") pageX = e.pageX;
    if (type === "m") pageX = e.changedTouches[0].pageX;

    if (distance < 0) {
      setDistance(0);
      setXp(0);
    } else if (distance > 1275) {
      setDistance(1275);
      setXp(1275);
    } else {
      setXp(distance);
    }
    setIsDragging(false);
    setClclickX(pageX);
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
    // console.log(`effect ${count}`);
    if (width === 0) setWidth(sliderBoxRef.current!.clientWidth);

    if (count === 1 || count === mainTop.length - 2) {
      if (!sliderOneRef.current!.style.transition) time = 2500;
      setTimeout(() => {
        sliderOneRef.current!.style.transition = "transform 500ms ease";
      }, 200);
    }

    if (stop) return;

    timer = setTimeout(() => {
      setCount(count + 1);
      setMoving(true);
      setTimeout(() => {
        setMoving(false);
      }, 500);
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

  const topSlidebuttonHandler = (type: string) => {
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

  const stopAndPlay = (type: string) => {
    if (type === "stop") {
      setStop(true);
      setMoving(true);
    } else {
      setStop(false);
      setTimeout(() => {
        setMoving(false);
      }, 600);
    }
  };

  const handler = (type: string) => {
    clickX === startX && navigate(`/trend/search?type=${type}`);
  };

  const trendButton = (type: string) => {
    if (distance > 1275 || distance < 0) return;
    setDistance(type === "prev" ? distance - 255 : distance + 255);
  };

  return (
    <main className="main-page">
      <div className="top-box">
        <h2 className="top-title">무더운 여름 날려버릴 계곡 추천!</h2>
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
              <span className={`${!stop && !topMoving ? "timer" : ""}`}></span>
            </span>
          </div>
          <div className="top-count">
            <span>
              {count === 0 ? 5 : count === mainTop.length - 1 ? 1 : count}
            </span>
            <span>of</span>
            <span>{mainTop.length - 2}</span>
          </div>
          <div className="top-slider-button">
            <button onClick={() => topSlidebuttonHandler("prev")}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {!stop && (
              <button onClick={() => stopAndPlay("stop")}>
                <FontAwesomeIcon icon={faPause} />
              </button>
            )}
            {stop && (
              <button onClick={() => stopAndPlay("play")}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )}
            <button onClick={() => topSlidebuttonHandler("next")}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="theme-container">
        <div
          className="theme-box"
          ref={sliderTwoRef}
          onMouseDown={(e) => mouseDown(e, "p")}
          onMouseMove={(e) => isDragging && mouseMove(e, "p")}
          onMouseUp={(e) => mouseUp(e, "p")}
          onMouseLeave={(e) => mouseUp(e, "p")}
          onTouchStart={(e) => mouseDown(e, "m")}
          onTouchMove={(e) => mouseMove(e, "m")}
          onTouchEnd={(e) => mouseUp(e, "m")}
        >
          <h3 className="trend-title">관광 트렌드</h3>
          <div
            className="theme"
            style={{ transform: `translateX(${-distance}px)` }}
          >
            {trend.map((item, index) => (
              <div
                key={index}
                className="theme-item"
                onClick={() => handler(item.type)}
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
            disabled={distance <= 0 ? true : false}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            id="right"
            onClick={() => trendButton("next")}
            disabled={distance >= 1275 ? true : false}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Main;
