import { useEffect } from "react";
import { firebaseActions } from "../../../redux/firebase-slice";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import { RootState, useAppDispatch } from "../../../redux/store";
import Feeling from "./Feelings";
import Reviews from "./UserReviews";
import Loading from "../../ui/loading/Loading";
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
  const firebaseState = useSelector((state: RootState) => state.firebase);
  const uid = firebaseState.userUid || "";
  const contentRef = doc(db, "content", contentId);

  useEffect(() => {
    const setData = async () => {
      try {
        if (!firebaseState.contentData[contentId]) {
          // 리뷰 컴포넌트에서 contentId 키가 없다는 것은 사용자가 새로고침한 경우다..
          const querySnapshot = await getDoc(contentRef);
          const docData = querySnapshot.data();
          dispatch(firebaseActions.updateContentData({ docData, contentId }));
        }
      } catch (error: any) {
        alert(error.message);
      }
    };
    setData();
  });

  return (
    <div className="Cotent-review" ref={reviewRef}>
      {firebaseState.isLoading && <Loading />}
      {!firebaseState.isLoading && !firebaseState.succesGetData && (
        <GetDataError />
      )}
      {!firebaseState.isLoading && firebaseState.succesGetData && (
        <Feeling
          firebaseState={firebaseState}
          contentRef={contentRef}
          uid={uid}
          contentId={contentId}
        />
      )}
      {!firebaseState.isLoading && firebaseState.succesGetData && (
        <Reviews
          firebaseState={firebaseState}
          contentRef={contentRef}
          uid={uid}
          contentId={contentId}
          setReportModalOpen={setReportModalOpen}
        />
      )}
    </div>
  );
};

export default ContentRivews;
