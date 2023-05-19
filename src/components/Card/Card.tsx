import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Item } from "../../type/Common";
import { ContentData } from "../../type/UserData";
import { RootState, useAppDispatch } from "../../redux/store";
import { db } from "../../firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { firebaseActions } from "../../redux/firebase-slice";
import AnotherCard from "./AnotherCard";
// import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  month?: string;
  areaCode?: string;
  cat2?: string;
  cat3?: string;
  searchArray?: Item[];
  행사상태?: [boolean, boolean, boolean];
}

const Card = (props: CardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const firebaseState = useSelector((state: RootState) => state.firebase);
  // const contentData = firebaseState.contentData;

  // const cardClickHandler = async (contentId: string) => {
  //   let docData: ContentData;
  //   const contentRef = doc(db, "content", contentId);

  //   try {
  //     if (!contentData[contentId]) {
  //       const querySnapshot = await getDoc(contentRef);
  //       const contentData1 = querySnapshot.data();

  //       if (!contentData1) {
  //         docData = {
  //           comment: [],
  //           detailImage: [],
  //           firstImage: "",
  //           expression: {},
  //         };
  //         await setDoc(contentRef, docData);
  //       } else {
  //         docData = contentData1 as ContentData;
  //       }
  //       dispatch(firebaseActions.updateContentData({ docData, contentId }));
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  //   navigate(`/content/${contentId}`);
  // };


  // const returnArray = () => {
  //   // let array: any = [];
  //   // let 행사종료: JSX.Element[] = [];
  //   // let 행사중: JSX.Element[] = [];
  //   // let 행사시작전: JSX.Element[] = [];

  //   if (props.title === "festival") {
  //     if (props.areaCode === "0") {
  //       //O(1)
  //       array = festivalState.monthArray[props.month!];
  //     } else {
  //       //O(n)
  //       array = festivalState.monthArray[props.month!].filter(
  //         (item) => item.areacode === props.areaCode
  //       );
  //     }
  //   }

  //   if (props.title === "result") {
  //     // 검색 결과.
  //     if (props.searchArray!.length === 0) {
  //       return;
  //     }
  //     array = props.searchArray!;
  //   }
  //   console.log(props);
  //   for (let item of array) {
  //     if (props.cat2 !== "all" && item.cat2 !== props.cat2) continue;

  //     if (props.cat3 !== "all") {
  //       if (item.cat3 !== props.cat3) continue;
  //     }

  //     const 행사상태 =
  //       props.title === "festival" &&
  //       calculateDate(
  //         item.eventstartdate!,
  //         item.eventenddate!,
  //         year,
  //         month,
  //         date
  //       );

  //     if (행사상태 === "진행중") {
  //       if (!props.행사상태![0]) continue;
  //     } else if (행사상태 === "행사종료") {
  //       if (!props.행사상태![2]) continue;
  //     } else {
  //       if (!props.행사상태![1]) continue;
  //     }

  //     let firstImage = item.firstimage;
  //     let imageUri = "";

  //     if (firstImage) {
  //       // 관광공사에서 제공하는 이미지 url이 하필 http....
  //       firstImage = firstImage.replace("http", "https");
  //     }

  //     if (contentData[item.contentid]) {
  //       // firebase storage에 저장된 이미지를 사용할 경우..
  //       // 그런데 이 방법은 좋기는 하나 이미지 저작권 문제를 피할 수 없음...
  //       imageUri = contentData[item.contentid].firstImage;
  //     }

  //     const element = (
  //       <div
  //         className="festival-item"
  //         key={item.title}
  //         onClick={() => cardClickHandler(item.contentid)}
  //       >
  //         <div className="image-box">
  //           <img
  //             className="festival-image"
  //             src={firstImage || imageUri || "/images/NoImage.png"}
  //             alt={item.title}
  //             loading={"lazy"}
  //           ></img>
  //         </div>
  //         <p
  //           className={`cal-date ${
  //             행사상태 === "진행중"
  //               ? "ing"
  //               : 행사상태 === "행사종료"
  //               ? "end"
  //               : "aft"
  //           }`}
  //         >
  //           {행사상태}
  //         </p>
  //         <div className="festival-text">
  //           <h3 className="prevent-overflow">{item.title}</h3>
  //           <p className="festival-date">
  //             {dataSlice(item.eventstartdate, item.eventenddate)}
  //           </p>
  //         </div>
  //       </div>
  //     );

  //     if (행사상태 === "행사종료") {
  //       행사종료.push(element);
  //       continue;
  //     } else if (행사상태 === "진행중") {
  //       행사중.push(element);
  //       continue;
  //     } else {
  //       행사시작전.push(element);
  //     }
  //   }
  //   return [...행사중, ...행사시작전, ...행사종료];
  // };
  console.log('????????')
  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">
        {props.title !== "festival" && <AnotherCard title={props.title}/>}
        {/* {props.title === "festival" && <FestivalCard />} */}
      </div>
    </article>
  );
};

export default Card;
