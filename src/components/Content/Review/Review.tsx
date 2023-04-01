import { doc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase/firestore";
import { RootState } from "../../../redux/store";
import "./Review.css";
import Feeling from "./Feeling";
import Reviews from "./Reviews";

interface ReviewProps {
  contentId: string;
}

const Review = ({ contentId }: ReviewProps) => {
  const firebaseState = useSelector((state: RootState) => state.firebase);
  const uid = firebaseState.userUid || "";
  const contentRef = doc(db, "content", contentId);

  return (
    <div className="Cotent-review">
      <Feeling firebaseState={firebaseState} contentRef={contentRef} contentId={contentId} />
      <Reviews
        firebaseState={firebaseState}
        contentRef={contentRef}
        uid={uid}
        contentId={contentId}
      />
    </div>
  );
};

export default Review;
