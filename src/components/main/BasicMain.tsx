import { useNavigate } from "react-router-dom";
import { CurrentSeason } from "../../modules/CurrentSeason";
// import { festivalActions } from "../../redux/festival-slice";
// import { useAppDispatch } from "../../redux/store";
import "./BasicMain.css";

const BasicMain = () => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  let url: string;
  const mainBoxClickHandler = (click: string) => {
    if (click === "all-festival") url = "/all-festival/month/all";

    if (click === "regions") {
      // dispatch(festivalActions.sortDataByRegion());
      url = "/regions/areacode/0";
    }
    if (click === "seasons") {
      url = `/seasons/${CurrentSeason()}`;
      // dispatch(festivalActions.sortDataBySeason());
    }
    navigate(url);
  };

  return (
    <main className="main-box1">
      <div
        className="intro-box"
        onClick={() => mainBoxClickHandler("all-festival")}
      >
        <div>
          <div>2023년 축제</div>
        </div>
      </div>
      <div className="intro-box" onClick={() => mainBoxClickHandler("regions")}>
        <div>
          <div>지역별!</div>
        </div>
      </div>
      <div className="intro-box" onClick={() => mainBoxClickHandler("seasons")}>
        <div>
          <div>2023년 계절별</div>
        </div>
      </div>
    </main>
  );
};

export default BasicMain;
