import { CommentType } from "types/DataType";
import { useEffect } from "react";
import { useAppDispatch } from "store/store";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import { replyActions } from "store/reply-slice";
import { originCommentActions } from "store/origin_comment-slice";
import { deleteComment } from "features/comments/api/firestoreUtils";
import "./DeleteModal.css";

interface DeleteProps {
  role: string;
  comment_data: CommentType;
}

const DeleteModal = ({ role, comment_data }: DeleteProps) => {
  const dispatch = useAppDispatch();
  const { createdAt, user_id, origin_id } = comment_data;
  const comment_id = createdAt + user_id;

  const clearModalInfo = () => {
    dispatch(modalActions.toggleToastModal({ comment_id }));
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearModalInfo();
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  const deleteCommentHandler = async () => {
    if (!comment_id) return alert("댓글 정보가 없습니다.");

    let api_state = "댓글을 삭제 중입니다.";
    dispatch(modalActions.toggleToastModal({ api_state }));

    try {
      const isExisingOrigin = await deleteComment(origin_id, comment_id);

      /* 1. 내가 방금 작성한 답글 삭제 (my) => myReply 상태만 업데이트 */
      if (role === "my" && origin_id) {
        dispatch(myReplyActions.deleteMyReply({ origin_id, comment_id }));
      }

      /* 답글 삭제 (reply) => replyComments, originComment 상태 업데이트 */
      if (role === "reply" && origin_id) {
        if (isExisingOrigin) {
          dispatch(
            originCommentActions.changeReplyCount({
              type: "delete",
              comment_id: origin_id,
            }),
          );
        }
        dispatch(replyActions.deleteReply({ origin_id, comment_id }));
      }

      /* 오리지널(최상위) 댓글 삭제 */
      if (role === "origin") {
        dispatch(replyActions.deleteReply({ origin_id: comment_id }));
        dispatch(myReplyActions.deleteMyReply({ origin_id: comment_id }));
        dispatch(originCommentActions.deleteComment({ comment_id }));
      }

      api_state = "댓글을 삭제했습니다.";
    } catch (error: any) {
      api_state = "오류가 발생했습니다.";
    } finally {
      dispatch(modalActions.toggleToastModal({ api_state }));
    }
  };

  return (
    <div className="Delete-Modal-Background">
      <div className="Delete-Modal">
        <p>정말로 삭제하시겠습니까?</p>
        <div className="Delete-button-box">
          <button onClick={clearModalInfo}>취소</button>
          <button onClick={deleteCommentHandler}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
