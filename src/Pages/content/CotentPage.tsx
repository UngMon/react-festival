import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "../../features/content/content-images/Slider";
import Detail from "../../features/content/content-detail/Detail";
import MenuBar from "../../features/content/content-menu-bar/MenuBar";
import LikeButton from "features/content/like-button/LikeButton";
import CommentForm from "../../features/comments/components/form/CommentForm";
import CommentArea from "features/comments/CommentContainer";
import FeedbackToast from "common/feedback-toast/FeedbackToast";
import "./CotentPage.css";

const CotentPage = () => {
  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const content_type: string = param.get("contentTypeId")!;
  const content_id: string = param.get("contentId")!;

  return (
    <main className="Content">
      <Slider content_id={content_id} />
      <MenuBar infoRef={infoRef} reviewRef={reviewRef} />
      <Detail
        infoRef={infoRef}
        content_id={content_id}
        content_type={content_type}
      />
      <section className="Content-Review">
        <LikeButton content_id={content_id} />
        <div ref={reviewRef}>
          <CommentForm content_type={content_type} content_id={content_id} />
          <CommentArea content_id={content_id} />
        </div>
      </section>
      <FeedbackToast />
    </main>
  );
};

export default CotentPage;
