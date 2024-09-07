import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomSlide.css";

const bottom = [
  {
    title: "건축과 자연이 어우러진 카페",
    tag: "카페",
    text: "각기 다른 분위기와 독특한 개성을 지닌 이 카페들은 일상 속 작은 휴식과 특별한 경험을 선사합니다.",
    color: "linear-gradient(180deg, #b6cdff, #edf1f4)",
    url: "/images/bottom/cafe.jpeg",
  },
  {
    title: "예술과 문화가 숨 쉬는 특별한 공간",
    tag: "복합문화공간",
    text: "예술과 자연을 현대적으로 재해석한 이 특별한 공간들은 깊이 있는 문화적 경험을 제공합니다.",
    color: "yellow",
    url: "/images/bottom/culture.jpg",
  },
  {
    title: "도심속 트렌디한 플래그쉽 스토어",
    tag: "플래그쉽 스토어",
    text: "창의성과 현대적인 감각이 어우러진 공간들로, 트렌드를 선도하며 독특한 경험을 제공합니다.",
    color: "gray",
    url: "/images/bottom/plagship.jpeg",
  },
  {
    title: "잔잔한 분위기의 뮤직 스토어",
    tag: "뮤직 스토어",
    text: "특별한 공간에서 음악과 편안한 시간을 보내세요!",
    color: "beige",
    url: "/images/bottom/musicplate.jpeg",
  },
  {
    title: "놓칠 수 없는 서울의 Bar",
    tag: "Bar",
    text: "클래식하고 우아한 장소에서 술 한 잔 어때요?",
    color: "beige",
    url: "/images/bottom/bar.jpeg",
  },
];

const BottomSlide = () => {
  const [index, setIndex] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <section className="Bottom-Container">
      <div className="Bottom-Title">
        <h3>2024 추천 Pick!</h3>
        <p>일상 속에서 쉽게 접할 수 있는 독특하고 멋진 장소</p>
      </div>
      <div className="Bottom-Slide">
        <div className="Picked-Picture" onTouchEnd={() => navigate(`/pick?theme=${index}`)}>
          <img src={bottom[index].url} alt={bottom[index].title} />
          <div>
            <h4>{bottom[index].title}</h4>
            <p>{bottom[index].text}</p>
          </div>
        </div>
        <ul>
          {bottom.map((item, idx) => (
            <li
              className={idx === index ? "op-zero" : ""}
              id={idx === index ? "picked" : "none"}
              key={idx}
              onClick={() => setIndex(idx)}
            >
              <div>
                <img src={item.url} alt={item.title} />
              </div>
              <div id={idx === index ? "textani1" : "none"}>{item.tag}</div>
              <div id={idx === index ? "textani2" : "none"}>
                <h4>{item.tag}</h4>
                <p>{item.text}</p>
                <button
                  type="button"
                  id={idx === index ? "buttonani" : "none"}
                  onClick={() =>
                    idx === index && navigate(`/pick?theme=${idx}`)
                  }
                >
                  더 보기
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BottomSlide;
