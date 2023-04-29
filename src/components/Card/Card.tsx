import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ContentData, Item } from "../../type/Type";
import { dataSlice } from "../../utils/DataSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { calculateDate } from "../../utils/CalculateDate";
import { db } from "../../firebase";
import { nowDate } from "../../utils/NowDate";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { firebaseActions } from "../../redux/firebase-slice";
import "./Card.css";

interface CardProps {
  type: string;
  month?: string;
  areaCode?: string;
  season?: string;
  searchArray?: Item[];
}

const Card = (props: CardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  const firevaseState = useSelector((state: RootState) => state.firebase);
  const contentData = firevaseState.contentData;

  const cardClickHandler = async (contentId: string) => {
    let docData: ContentData;
    
    try {
      if (!contentData[contentId]) {
        const contentRef = doc(db, "content", contentId);
        const querySnapshot = await getDoc(contentRef);
        const contentData1 = querySnapshot.data();

        if (!contentData1) {
          docData = {
            comment: [],
            detailImage: [],
            firstImage: "",
            expression: {},
          };
          await setDoc(contentRef, docData);
        } else {
          docData = contentData1 as ContentData;
        }
        dispatch(firebaseActions.updateContentData({ docData, contentId }));
      }
    } catch (error: any) {
      console.log(error.message);
    }
    navigate(`/content/${contentId}`);
  };

  const { year, month, date } = nowDate();

  const returnArray = () => {
    let array: Item[] = [];
    let 행사종료: JSX.Element[] = [];
    let 행사중: JSX.Element[] = [];
    let 행사시작전: JSX.Element[] = [];

    if (props.type === "monthly")
      array = festivalState.monthArray[props.month!];

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

    for (let item of array) {
      const 행사상태 = calculateDate(
        item.eventstartdate,
        item.eventenddate,
        year,
        month,
        date
      );
      let firstImage = item.firstimage;
      let imageUri = "";

      if (firstImage) {
        // 관광공사에서 제공하는 이미지 url이 하필 http....
        firstImage = firstImage.replace("http", "https");
      }

      if (contentData[item.contentid]) {
        // firebase storage에 저장된 이미지를 사용할 경우..
        // 그런데 이 방법은 좋기는 하나 이미지 저작권 문제를 피할 수 없음...
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
              src={firstImage || imageUri || "/images/NoImage.png"}
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
