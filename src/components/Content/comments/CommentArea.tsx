import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { fetchCommentData } from "api/firestoreUtils";
import { originCommentActions } from "store/origin_comment-slice";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import CommentBox from "./CommentBox/CommentBox";
import LoadingSpinnerTwo from "components/Common/Loading/LoadingSpinnerTwo";
import ReplyArea from "./Replies/ReplyArea";
import "./CommentArea.css";

interface T {
  content_id: string;
}

const CommentArea = ({ content_id }: T) => {
  const dispatch = useAppDispatch();
  const { comments, afterIndex, record } = useSelector(
    (state: RootState) => state.origin_comment
  );
  const loading = useRef<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();
  const isMatch = record === content_id;
  const isFinish = afterIndex === "finish";

  useEffect(() => {
    if ((isMatch && isFinish) || !intersecting || loading.current) return;

    const getCommentData = async () => {
      loading.current = true;
      const origin_id = null;
      const checkedAfterIndex = isMatch ? afterIndex : null;

      try {
        const { comment_datas, lastDataIndex } = await fetchCommentData(
          origin_id,
          checkedAfterIndex,
          content_id
        );

        dispatch(
          originCommentActions.setComment({
            comment_datas,
            startAfter: lastDataIndex,
            content_id,
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
  }, [
    dispatch,
    intersecting,
    afterIndex,
    content_id,
    record,
    isFinish,
    isMatch,
  ]);

  return (
    <div className="comments-area">
      {isMatch && comments.length === 0 && afterIndex === "finish" && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {isMatch && comments.length > 0 &&
        comments.map((item) => (
          <div
            className="comment-box-container"
            key={item.createdAt + item.user_id}
          >
            <CommentBox type={"origin"} deepth={0} comment_data={item} />
            <ReplyArea comment_data={item} />
          </div>
        ))}
      {intersecting && (!isMatch || !isFinish) && (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      )}
      <div className="comment-target" ref={targetRef}></div>
    </div>
  );
};

export default CommentArea;
