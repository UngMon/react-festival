import { useEffect, useRef, useState } from "react";
import { CurrentSeason } from "../../utils/CurrentSeason";
import { nowDate } from "../../utils/NowDate";
import "./Main.css";

const Main = () => {
  const currentSeason = CurrentSeason();
  const { month } = nowDate();
  const [width, setWidth] = useState<number>(0);
  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const length = 3;
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setWidth(sliderBoxRef.current!.clientWidth);
    setTimeout(() => {
      setCount(count);
    }, 1000);
  }, [sliderBoxRef, count]);

  return (
    <main className="main-page">
      <h2 className="main-title">오늘은 어디로 갈까?</h2>
      <h2 className="main-title1">이 달의 추천 Pick!</h2>
      <div className="main-slide-box" ref={sliderBoxRef}>
        <div
          className="m-slider"
          ref={slideRef}
          style={{
            transform: `translateX(${-width * count}px)`,
            transition: "transform 250ms ease",
          }}
        >
          <div className="m-slide" style={{ width: width }}>
            이미지 슬라이드
          </div>
          <div className="m-slide" style={{ width: width }}>
            1
          </div>
          <div className="m-slide" style={{ width: width }}>
            2
          </div>
          <div className="m-slide" style={{ width: width }}>
            3
          </div>
        </div>
      </div>
      <div className="theme">
        <div>가족여행</div>
        <div>도보코스</div>
        <div>힐링코스</div>
        <div>반려동물</div>
      </div>
      {/* {currentSeason === "spring" && (
        <>
          <div className="background spring"></div>
          <div className="main-page-title">
            <h2>꽃피는 계절,</h2>
            <h2>함께하는 봄 축제로 새로운 시작을 맞이해보세요!</h2>
          </div>
        </>
      )}
      {currentSeason === "summer" && (
        <div className="background summer">
          <div className="main-page-title">
            <h2>더위를 날려버리고,</h2>
            <h2>즐거움 가득한 여름 축제로 함께 여름을 즐겨보세요!</h2>
          </div>
        </div>
      )}
      {currentSeason === "autumn" && (
        <div className="background autumn">
          <h2>가을바람이 불어오면,</h2>
          <h2>가을 축제로 함께 따뜻한 추억을 만들어보세요!</h2>
        </div>
      )}
      {currentSeason === "winter" && (
        <div className="background winter">
          <h2>추운 겨울,</h2>
          <h2>따뜻한 축제로 함께 노는 것은 어떨까요?</h2>
        </div>
      )} */}
      {/* <div className="start-button-box">
        <button onClick={() => navigate(`/month/${month}`)}>시작하기</button>
      </div> */}
    </main>
  );
};

export default Main;
