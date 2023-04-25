import { doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import { RootState } from "../../../redux/store";
import "./ContentReviews.css";
import Feeling from "./Feelings";
import Reviews from "./UserReviews";
import Loading from "../../UI/Loading";
import GetDataError from "../../error/GetDataError";

interface ReviewProps {
  setReportModalOpen: React.Dispatch<
    React.SetStateAction<[boolean, string, string, string, string]>
  >;
  reviewRef: React.RefObject<HTMLDivElement>;
  contentId: string;
}

const ContentRivews = ({ reviewRef, contentId, setReportModalOpen }: ReviewProps) => {
  const firebaseState = useSelector((state: RootState) => state.firebase);
  const uid = firebaseState.userUid || "";
  const contentRef = doc(db, "content", contentId);

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
