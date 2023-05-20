import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Item } from "../../type/Common";
import { ContentData } from "../../type/UserData";
import { RootState, useAppDispatch } from "../../redux/store";
import { db } from "../../firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { firebaseActions } from "../../redux/firebase-slice";
import AnotherCard from "./AnotherCard";
import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  searchArray?: Item[];
}

const Card = (props: CardProps) => {
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

  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">
        {props.title !== "festival" && <AnotherCard title={props.title}/>}
        {props.title === "festival" && <FestivalCard />}
      </div>
    </article>
  );
};

export default Card;
