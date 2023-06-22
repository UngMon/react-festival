import { useSearchParams } from "react-router-dom";
import SubMenu from "./SubMenu";
import MonthSelector from "./MonthSelector";
import RegionSelector from "./RegionSelector";
import Category from "./Category";
import OnGoingSelector from "./OnGoingSelector";
import Tags from "./Tags";
import "./UiBox.css";

interface T {
  title: string;
}

const trendTop: { [key: string]: string[] } = {
  gpt: ["챗 GPT에게 물어본 국내 여름 여행지", 'gpt'],
  산성여행: ["6월 추천 산성여행", 'fortress'],
  산책: ["매일 걷기 좋은 곳", 'walk'],
  힐링여행: ["함께 떠나는 힐링 테마 여행", 'healing'],
  반려동물: ["반려동물과 함께", 'pet'],
  전통한옥: ["전통 한옥", 'tradi'],
  웰니스: ["지친 몸을 달래는 웰니스 관광지", 'wellness'],
  워케이션: ["일과 휴식을 동시에! 워케이션 숙소", 'workation'],
  시골여행: ["쉼이 필요할 때, 시골로 떠나자!", 'country'],
};

const UiBox = ({ title }: T) => {
  const [params] = useSearchParams();

  const month = params.get("month")!;
  const type = params.get("type")!;
  const areaCode = params.get("areaCode")!;
  const cat1 = params.get("cat1")!;
  const cat2 = params.get("cat2")!;
  const cat3 = params.get("cat3")!;

  return (
    <div className="Ui-Box">
      {title !== "trend" && <SubMenu title={title} month={month!} />}
      {title === "trend" && (
        <div className="trend-top-box">
          <img
            className="trend-top"
            src={`/images/trend/${trendTop[type][1]}Top.jpg`}
            alt="img"
          ></img>
          <p>{trendTop[type][0]}</p>
        </div>
      )}
      {title !== "trend" && (
        <div id="picker-box">
          {title === "festival" && (
            <MonthSelector month={month} type={type} areaCode={areaCode} />
          )}

          <RegionSelector
            title={title}
            month={month}
            type={type}
            areaCode={areaCode}
            cat1={cat1}
            cat2={cat2}
            cat3={cat3}
          />
          <Category
            title={title}
            month={month}
            type={type}
            areaCode={areaCode}
            cat1={cat1}
            cat2={cat2}
            cat3={cat3}
          />
        </div>
      )}
      {title !== "trend" && (
        <Tags
          title={title}
          month={month}
          type={type}
          areaCode={areaCode}
          cat1={cat1}
          cat2={cat2}
          cat3={cat3}
        />
      )}
      {title === "festival" && <OnGoingSelector />}
    </div>
  );
};

export default UiBox;
