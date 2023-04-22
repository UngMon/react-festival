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
      <h2 className="">
        전국 축제, 공연, 행사를 <br />한 곳에서 보는
      </h2>
      <h4>축제모아!</h4>
    </main>
  );
};

export default BasicMain;
