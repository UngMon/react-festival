import { useState } from "react";
import { Comment } from "../../../type/UserDataType";
import UserCommentForm from "./UserCommentForm";
import CommentArea from "./comment/CommentArea";
import ReportModal from "./modal/ReportModal";

interface ReviewProps {
  content_type: string;
  content_id: string;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const UserReviews = ({ content_type, content_id, reviewRef }: ReviewProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  console.log("UserReviews Component Render");

  return (
    <div ref={reviewRef}>
      <ReportModal />
      <UserCommentForm
        setComments={setComments}
        content_type={content_type}
        content_id={content_id}
      />
      <CommentArea
        comments={comments}
        setComments={setComments}
        content_id={content_id}
      />
    </div>
  );
};

export default UserReviews;
