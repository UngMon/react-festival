import React, { useReducer } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Comment } from "../../../type/UserDataType";
import { RootState } from "../../../redux/store";
import { Report } from "../../../type/UserDataType";
import UserCommentForm from "./UserCommentForm";
import CommentBox from "./CommentBox";
import ReportModal from "./modal/ReportModal";
import "./UserReviews.css";
import { auth } from "../../../firebase";

interface ReviewProps {
  contentType: string;
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

const UserReviews = ({ contentType, contentId, reviewRef }: ReviewProps) => {
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
  console.log("UserReviews Component Render", userData, state, auth.currentUser?.email);
  // reportModal을 coomentBox로 옮길생각은 어떤가?

  return (
    <div ref={reviewRef}>
      {/* {reportModal.open && (
        <ReportModal
          contentId={contentData.contentId}
          reportModal={reportModal}
          setReportModal={setReportModal}
        />
      )} */}
      <UserCommentForm
        setComments={setComments}
        contentType={contentType}
        contentId={contentId}
        userData={userData}
        dispatch={dispatch}
      />
      <CommentBox
        comments={comments}
        setComments={setComments}
        contentId={contentId}
        state={state}
        dispatch={dispatch}
        userData={userData}
        setReportModal={setReportModal}
      />
    </div>
  );
};

export default UserReviews;
