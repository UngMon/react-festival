import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./SubMenu.css";

interface T {
  title: string;
}

const trendTop: { [key: string]: string[] } = {
  gpt: ["챗 GPT에게 물어본 국내 여름 여행지", "gpt"],
  산성여행: ["6월 추천 산성여행", "fortress"],
  산책: ["매일 걷기 좋은 곳", "walk"],
  힐링여행: ["함께 떠나는 힐링 테마 여행", "healing"],
  반려동물: ["반려동물과 함께", "pet"],
  전통한옥: ["전통 한옥", "tradi"],
  웰니스: ["지친 몸을 달래는 웰니스 관광지", "wellness"],
  워케이션: ["일과 휴식을 동시에! 워케이션 숙소", "workation"],
  시골여행: ["쉼이 필요할 때, 시골로 떠나자!", "country"],
};

const object: { [key: string]: string } = {
  tour: "관광지",
  culture: "문화시설",
  festival: "축제/공연/행사",
  travel: "여행코스",
  result: "검색결과",
};

const SubMenu = ({ title }: T) => {
  return (
    <>
      {title !== "trend" && (
        <nav className="subnav">
          <ul className="submenu">
            <li>
              <Link to="/">
                <img src="/images/home.png" alt="홈" width="25" />
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} />
            </li>
            <li>{object[title]}</li>
          </ul>
        </nav>
      )}
      {title === "trend" && (
        <div className="trend-top-box">
          {/* <img
            className="trend-top"
            src={`/images/trend/${trendTop[type][1]}Top.jpg`}
            alt="img"
          ></img>
          <p>{trendTop[type][0]}</p> */}
        </div>
      )}
    </>
  );
};

export default SubMenu;
