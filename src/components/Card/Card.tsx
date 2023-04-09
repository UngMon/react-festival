import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Item } from "../../modules/Type";
import { dataSlice } from "../../modules/DataSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { calculateDate } from "../../modules/CalculateDate";
import { setData } from "../../modules/SetData";
import { nowDate } from "../../modules/NowData";
import "./Card.css";
import { firebaseActions } from "../../redux/firebase-slice";

interface CardProps {
  type: string;
  month?: string;
  areaCode?: string;
  season?: string;
  searchArray?: Item[];
}

const Card = (props: CardProps) => {
  console.log("CArd");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const festivalState = useSelector((state: RootState) => state.festival);
  const contentData = useSelector(
    (state: RootState) => state.firebase.contentData
  );

  const festivalArray = sessionStorage.getItem("festivalArray");
  const cardClickHandler = (contentid: string) => {
    if (!contentData[contentid]) {
      setData(contentid);
      dispatch(firebaseActions.setCardData(contentid));
    }
    navigate(`/content/${contentid}`);
  };

  const { year, month, date } = nowDate();

  const returnArray = () => {
    let array: Item[] = [];
    let 행사종료: JSX.Element[] = [];
    let 행사중: JSX.Element[] = [];
    let 행사시작전: JSX.Element[] = [];

    if (props.month === "all") {
      if (props.type === "all")
        array = festivalState.festivalArray || festivalArray;

      if (props.type === "region")
        array = festivalState.regionArray[props.areaCode!];

      if (props.type === "season")
        array = festivalState.seasonArray[props.season!];

      if (props.type === "result") {
        if (props.searchArray!.length === 0) {
          return;
        }
        array = props.searchArray!;
      }
    } else array = festivalState.monthArray[props.month!];

    for (let item of array) {
      const 행사상태 = calculateDate(
        item.eventstartdate,
        item.eventenddate,
        year,
        month,
        date
      );

      let imageUri = "";
      if (contentData[item.contentid]) {
        imageUri = contentData[item.contentid].firstImage;
      }

      const element = (
        <div
          className="festival-item"
          key={item.title}
          onClick={() => cardClickHandler(item.contentid)}
        >
          <div className="image-box">
            <img
              className="festival-image"
              src={item.firstimage || imageUri || "./NoImage.png"}
              alt={item.title}
            ></img>
          </div>
          <div className="festival-text">
            <h3>{item.title}</h3>
            <p className="festival-date">
              {dataSlice(item.eventstartdate, item.eventenddate)}
            </p>
            <p className="cal-date">{행사상태}</p>
          </div>
        </div>
      );

      if (행사상태 === "행사종료") {
        행사종료.push(element);
        continue;
      } else if (행사상태 === "진행중") {
        행사중.push(element);
        continue;
      } else {
        행사시작전.push(element);
      }
    }
    return [...행사중, ...행사시작전, ...행사종료];
  };

  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">{returnArray()}</div>
    </article>
  );
};

export default Card;
