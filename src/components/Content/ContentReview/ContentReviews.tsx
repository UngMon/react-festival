import { useEffect, useState } from "react";
import { firebaseActions } from "../../../redux/firebase-slice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import { RootState, useAppDispatch } from "../../../redux/store";
import { ContentData } from "../../../type/UserData";
import Feeling from "./Feelings";
import UserReviews from "./UserReviews";
import Loading from "../../loading/Loading";
import GetDataError from "../../error/GetDataError";
import "./ContentReviews.css";

interface ReviewProps {
  setReportModalOpen: React.Dispatch<
    React.SetStateAction<[boolean, string, string, string, string]>
  >;
  reviewRef: React.RefObject<HTMLDivElement>;
  contentId: string;
}

const ContentRivews = ({
  reviewRef,
  contentId,
  setReportModalOpen,
}: ReviewProps) => {
  const dispatch = useAppDispatch();
  const firebase = useSelector((state: RootState) => state.firebase);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  const uid = firebase.userUid || "";
  const contentRef = doc(db, "content", contentId);

  useEffect(() => {
    const setData = async () => {
      let docData: ContentData;
      const contentRef = doc(db, "content", contentId);

      try {
        // firestor DB에 해당 컨텐츠 id 접근하여 .data()메소드를 통해 필드 존재 여부 확인
        const contentUserData = (await getDoc(contentRef)).data();
 
        if (!contentUserData) {
          docData = {
            comment: [],
            detailImage: [],
            firstImage: "",
            expression: {},
          };
          // 위 오브젝트를 'content' 컬렉션에 다큐먼트 필드 생성
          await setDoc(contentRef, docData);
        } else {
          docData = contentUserData as ContentData;
        }
        dispatch(firebaseActions.updateContentData({ docData, contentId }));
      } catch (error: any) {
        alert(error.message);
        setError(true);
        dispatch(firebaseActions.failedGetData());
      }
    };

    // 사용자가 해당 콘텐츠를 처음 클릭하거나, 새로고침 했거나의 경우
    if (!firebase.contentData[contentId] && isLoading) {
      setData();
      setLoading(false);
      error && setError(false);
    }

  }, [dispatch, contentId, firebase, isLoading, error]);

  return (
    <div className="Cotent-review" ref={reviewRef}>
      {!firebase.contentData[contentId] && !error && <Loading/>}
      {error && <GetDataError/>}
      {firebase.contentData[contentId] && (
        <>
          <Feeling
            firebaseState={firebase}
            contentRef={contentRef}
            uid={uid}
            contentId={contentId}
          />
          <UserReviews
            firebaseState={firebase}
            contentRef={contentRef}
            uid={uid}
            contentId={contentId}
            setReportModalOpen={setReportModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default ContentRivews;
