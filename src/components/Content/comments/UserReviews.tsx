import React, { useReducer } from "react";
import { useState } from "react";
// import {
//   collection,
//   getDocs,
//   limit,
//   orderBy,
//   query,
//   DocumentData,
//   startAfter,
//   Query,
// } from "firebase/firestore";
// import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
// import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { Comment } from "../../../type/UserDataType";
import { RootState } from "../../../redux/store";
import { Report } from "../../../type/UserDataType";
import UserCommentForm from "./UserCommentForm";
import CommentBox from "./CommentBox";
import ReportModal from "./modal/ReportModal";
import "./UserReviews.css";

interface ReviewProps {
  collectionName: string;
  contentId: string;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const initialState = {
  loading: false,
};

const reducer = (
  state: { loading: boolean },
  action: { type: "pending" | "fulfiled" | "reject" }
) => {
  switch (action.type) {
    case "pending":
      return { loading: true };
    case "fulfiled":
      return { loading: false };
    case "reject":
      return { loading: false };
    default:
      return state;
  }
};

const UserReviews = React.memo(
  ({ collectionName, contentId, reviewRef }: ReviewProps) => {
    const userData = useSelector((state: RootState) => state.firebase);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [comments, setComments] = useState<Comment[]>([]);
    const [reportModal, setReportModal] = useState<Report>({
      open: false,
      when: "",
      userUid: "",
      name: "",
      text: "",
    });

    return (
      <div ref={reviewRef}>
        {reportModal.open && (
          <ReportModal
            contentId={contentId}
            reportModal={reportModal}
            setReportModal={setReportModal}
          />
        )}
        <UserCommentForm
          comments={comments}
          setComments={setComments}
          collectionName={collectionName}
          contentId={contentId}
          userData={userData}
          dispatch={dispatch}
        />
        <CommentBox
          comments={comments}
          setComments={setComments}
          collectionName={collectionName}
          contentId={contentId}
          state={state}
          dispatch={dispatch}
          userData={userData}
          setReportModal={setReportModal}
        />
      </div>
    );
  }
);

export default UserReviews;
