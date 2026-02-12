import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { fetchCommentData } from "features/comments/api/firestoreUtils";
import { originCommentActions } from "store/origin_comment-slice";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import CommentBox from "./components/layout/CommentBox";
import ReplyBox from "./components/layout/ReplyBox";
import "./CommentContainer.css";

interface T {
  content_id: string;
}

const CommentContainer = ({ content_id }: T) => {
  const dispatch = useAppDispatch();
  const { comments, afterIndex, record } = useSelector(
    (state: RootState) => state.origin_comment,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();
  const isMatch = record === content_id;
  const isFinish = afterIndex === "finish";

  useEffect(() => {
    if ((isMatch && isFinish) || !intersecting || loading) return;

    const getCommentData = async () => {
      setLoading(true);
      const origin_id = null;
      const checkedAfterIndex = isMatch ? afterIndex : null;

      try {
        const { comment_datas, lastDataIndex } = await fetchCommentData(
          origin_id,
          checkedAfterIndex,
          content_id,
        );

        dispatch(
          originCommentActions.setComment({
            comment_datas,
            startAfter: lastDataIndex,
            content_id,
          }),
        );
      } catch (error: any) {
        alert("댓글을 불러오지 못 했습니다.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    getCommentData();

    return () => {
      /* 
        1. 클린업 함수로 페이지 언마운트때, comment관련 redux 상태 초기화 하기
      */
    };
  }, [
    dispatch,
    intersecting,
    afterIndex,
    content_id,
    record,
    isFinish,
    isMatch,
    loading,
  ]);

  return (
    <div className="comments-area">
      {isMatch && comments.length === 0 && afterIndex === "finish" && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {isMatch &&
        comments.length > 0 &&
        comments.map((data) => (
          <div
            className="comment-box-container"
            key={data.createdAt + data.user_id}
          >
            <CommentBox type={"origin"} depth={0} comment_data={data} />
            <ReplyBox comment_data={data} />
          </div>
        ))}
      {intersecting && (!isMatch || !isFinish) && (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      )}
      <div className="comment-target" ref={targetRef}></div>
    </div>
  );
};

export default CommentContainer;
