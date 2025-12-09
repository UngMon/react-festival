import { CommentType } from "type/DataType";
import { useEffect } from "react";
import { useAppDispatch } from "store/store";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import { replyActions } from "store/reply-slice";
import { originCommentActions } from "store/origin_comment-slice";
import { deleteComment } from "api/firestoreUtils";
import "./DeleteModal.css";

interface DeleteProps {
  comment_data: CommentType;
  type: string;
}

const DeleteModal = ({ comment_data, type }: DeleteProps) => {
  const dispatch = useAppDispatch();
  const { createdAt, user_id, origin_id } = comment_data;
  const comment_id = createdAt + user_id;

  const clearModalInfo = () => {
    dispatch(modalActions.clearModalInfo({ comment_id, type }));
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

    let api_state = "";
    dispatch(modalActions.clearModalInfo({ type: "delete" }));

    try {
      const isExisingOrigin = await deleteComment(origin_id, comment_id);

      if (origin_id) {
        /* 1. 내가 작성한 답글 삭제 (my) => myReply 상태만 업데이트 */
        if (type === "my") {
          dispatch(myReplyActions.deleteMyReply({ origin_id, comment_id }));
        }

        /* 답글 삭제 (reply) => replyComments, originComment 상태 업데이트 */
        if (type === "reply") {
          if (isExisingOrigin) {
            dispatch(
              originCommentActions.changeReplyCount({
                type,
                comment_id: origin_id,
              })
            );
          }
          dispatch(replyActions.deleteReply({ origin_id, comment_id }));
        }
      } else {
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
