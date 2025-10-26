import { useEffect } from "react";
import { PickComment } from "type/UserDataType";
import { useAppDispatch } from "store/store";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import { replyActions } from "store/reply-slice";
import { originCommentActions } from "store/origin_comment-slice";
import { db } from "../../../../firebase";
import { doc, increment, writeBatch } from "firebase/firestore";
import "./DeleteModal.css";

interface DeleteProps {
  modalInfo: PickComment;
  origin_index: number;
  reply_index?: number;
  type: string;
}

const DeleteModal = ({
  modalInfo,
  origin_index,
  reply_index,
  type,
}: DeleteProps) => {
  const dispatch = useAppDispatch();
  const { comment_data, comment_id } = modalInfo;

  const clearModalInfo = () => {
    dispatch(modalActions.clearModalInfo({ comment_id }));
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
    const batch = writeBatch(db);
    clearModalInfo();

    try {
      const origin_id = comment_data?.origin_id;

      if (origin_id) {
        const deleteDocRef = doc(db, "comments", comment_id);
        const originalDocRef = doc(db, "comments", origin_id);

        batch.delete(deleteDocRef);
        batch.update(originalDocRef, { reply_count: increment(-1) });
        await batch.commit();

        /* 1. 내가 작성한 답글 삭제 (my) => myReply 상태만 업데이트 */
        if (type === "my") {
          dispatch(myReplyActions.deleteMyReply({ origin_id, comment_id }));
        }

        /* 답글 삭제 (to-reply) => replyComments 상태만 업데이트 */
        if (type === "reply" && reply_index !== undefined) {
          dispatch(replyActions.deleteReply({ reply_index, origin_id }));
          dispatch(
            originCommentActions.changeReplyCount({ origin_index, type })
          );
        }
      }

      if (!origin_id) {
        const originalDocRef = doc(db, "comments", comment_id!);

        batch.delete(originalDocRef);

        await batch.commit();
        dispatch(replyActions.deleteReply({ origin_id: comment_id }));
        dispatch(myReplyActions.deleteMyReply({ origin_id: comment_id }));
        dispatch(originCommentActions.deleteComment({ origin_index }));
      }
    } catch (error: any) {
      console.log(error)
      alert(`오류가 발생했습니다. 지속적인 오류가 발생한다면 문의해주세요!`);
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
