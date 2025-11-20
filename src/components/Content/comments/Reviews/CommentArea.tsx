import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../store/store";
import { fetchCommentData } from "api/fetchCommentData";
import { originCommentActions } from "../../../../store/origin_comment-slice";
import { useIntersectionObserver } from "../../../../hooks/useIntersectionObserver";
import CommentBox from "./CommentBox";
import LoadingSpinnerTwo from "../../../Loading/LoadingSpinnerTwo";
import ReplyArea from "../Reply/ReplyArea";
import "./CommentArea.css";

interface T {
  content_id: string;
}

const CommentArea = ({ content_id }: T) => {
  const dispatch = useAppDispatch();
  const { comments, afterIndex } = useSelector(
    (state: RootState) => state.origin_comment
  );
  const loading = useRef<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();

  useEffect(() => {
    if (afterIndex === "finish" || !intersecting || loading.current) return;

    const getCommentData = async () => {
      loading.current = true;
      const origin_id = null;

      try {
        const { comment_datas, lastDataIndex } = await fetchCommentData(
          origin_id,
          afterIndex,
          content_id
        );

        dispatch(
          originCommentActions.setComment({
            comment_datas,
            startAfter: lastDataIndex,
          })
        );
      } catch (error: any) {
        alert("댓글을 불러오지 못 했습니다.");
      } finally {
        setTimeout(() => {
          loading.current = false;
        }, 100);
      }
    };

    getCommentData();
  }, [dispatch, intersecting, afterIndex, content_id]);

  return (
    <div className="comments-area">
      {comments.length === 0 && afterIndex === "finish" && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {comments.length > 0 &&
        comments.map((item, index) => (
          <div
            className="comment-box-container"
            key={item.createdAt + item.user_id}
          >
            <CommentBox
              type={"origin"}
              deepth={0}
              comment_data={item}
            />
            <ReplyArea comment_data={item} />
          </div>
        ))}
      {intersecting && afterIndex !== "finish" && (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      )}
      <div className="comment-target" ref={targetRef}></div>
    </div>
  );
};

export default CommentArea;
