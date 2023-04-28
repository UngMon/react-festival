import { CurrentSeason } from "../../utils/CurrentSeason";
import "./BasicMain.css";

const BasicMain = () => {
  const currentSeason = CurrentSeason();

  return (
    <main className={`main-page ${currentSeason + "Image"}`}>
      {currentSeason === "spring" && (
        <div className="main-page-title">
          <h2>꽃피는 계절,</h2>
          <h2>함께하는 봄 축제로 새로운 시작을 맞이해보세요!</h2>
        </div>
      )}
      {currentSeason === "summer" && (
        <div className="main-page-title">
          <h2>더위를 날려버리고,</h2>
          <h2>즐거움 가득한 여름 축제로 함께 여름을 즐겨보세요!</h2>
        </div>
      )}
      {currentSeason === "autumn" && (
        <div className="main-page-title">
          <h2>가을바람이 불어오면,</h2>
          <h2>가을 축제로 함께 따뜻한 추억을 만들어보세요!</h2>
        </div>
      )}
      {currentSeason === "winter" && (
        <div className="main-page-title">
          <h2>추운 겨울,</h2>
          <h2>따뜻한 축제로 함께 노는 것은 어떨까요?</h2>
        </div>
      )}
      <div className="start-button-box">
        <img src="/images/arrow.png" alt='화살표'></img>
        <button>시작하기</button>
      </div>
    </main>
  );
};

export default BasicMain;
