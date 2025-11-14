import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "./ImageSlide/Slider";
import Detail from "./Detail/Detail";
import MenuBar from "./MenuBar/MenuBar";
import LikeButton from "./LikeButton/LikeButton";
import CommentForm from "./Comments/CommentForm/CommentForm";
import CommentArea from "./Comments/Reviews/CommentArea";
import "./Content.css";

const Cotent = () => {
  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const content_type: string = param.get("contentTypeId")!;
  const content_id: string = param.get("contentId")!;

  return (
    <main className="Content">
      {/* <Slider content_id={content_id} />
      <MenuBar infoRef={infoRef} reviewRef={reviewRef} />
      <Detail
        infoRef={infoRef}
        content_id={content_id}
        content_type={content_type}
      /> */}
      <section className="Content-Review">
        {/* <LikeButton content_id={content_id} /> */}
        <div ref={reviewRef}>
          <CommentForm content_type={content_type} content_id={content_id} />
          <CommentArea content_id={content_id} />
        </div>
      </section>
    </main>
  );
};

export default Cotent;
