import UserCommentForm from "./CommentForm/CommentForm";
import CommentArea from "./Reviews/CommentArea";
import ReportModal from "./Modal/ReportModal";

interface ReviewProps {
  content_type: string;
  content_id: string;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const Comments = ({ content_type, content_id, reviewRef }: ReviewProps) => {
  console.log("UserReviews Component Render");

  return (
    <div ref={reviewRef}>
      <ReportModal />
      <UserCommentForm content_type={content_type} content_id={content_id} />
      <CommentArea content_id={content_id} />
    </div>
  );
};

export default Comments;
