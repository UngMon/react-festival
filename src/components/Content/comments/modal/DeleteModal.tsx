import { useEffect } from "react";
import { Comment, PickComment } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import "./DeleteModal.css";

interface DeleteProps {
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const DeleteModal = ({
  pickedComment,
  setPickedComment,
  setComments,
  setReplyComments,
  setMyReply,
}: DeleteProps) => {
  const { originIndex, replyIndex, commentData, commentId, type } =
    pickedComment;
  console.log(pickedComment);
  const refreshPickedComment = () => {
    setPickedComment({
      originIndex: undefined,
      replyIndex: undefined,
      openOption: "",
      commentData: null,
      commentId: "",
      type: "",
    });
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") refreshPickedComment();
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  const deleteReviewHandler = async () => {
    const batch = writeBatch(db);
    refreshPickedComment();

    try {
      if (commentData?.origin_id) {
        const deleteDocRef = doc(db, "comments", commentId);
        const updateDocRef = doc(db, "comments", commentData.origin_id);

        batch.delete(deleteDocRef);
        batch.update(updateDocRef, { reply_count: increment(-1) });
        await batch.commit();

        // /* 1. 내가 작성한 답글 삭제 (my)
        // => myReply 상태만 업데이트 */
        if (type === "my") {
          console.log(pickedComment);
          setMyReply((prevMyReply) => {
            const newObject: Record<string, Comment> = JSON.parse(
              JSON.stringify(
                prevMyReply[pickedComment.commentData!.origin_id!] || []
              )
            );
            delete newObject[pickedComment.commentId];

            return {
              ...prevMyReply,
              [pickedComment.commentData!.origin_id!]: newObject,
            };
          });
        }

        /* 답글 삭제 (to-reply)
        => replyComments 상태만 업데이트 */
        if (type === "to-reply") {
          setReplyComments((prevReply) => {
            const { [commentData!.origin_id!]: _, ...rest } = prevReply;
            const newReplies = prevReply[commentData!.origin_id!].filter(
              (_, i) => i !== replyIndex
            );

            return newReplies.length > 0
              ? { ...rest, [commentData!.origin_id!]: newReplies }
              : rest;
          });

          setComments((prevComments) => {
            const changedComment: Comment = JSON.parse(
              JSON.stringify(prevComments[originIndex!])
            );
            changedComment.reply_count -= 1;

            return [
              ...prevComments.slice(0, originIndex!),
              changedComment,
              ...prevComments.slice(originIndex! + 1),
            ];
          });
        }
      }

      if (!commentData?.origin_id) {
        const originalDeleteRef = doc(db, "comments", commentId);
        const q = query(
          collection(db, "comments"),
          where("originUid", "==", commentData!.createdAt + commentData!.user_id)
        );
        batch.delete(originalDeleteRef);

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();

        setComments((prevComments) =>
          prevComments.filter((_, i) => i !== originIndex)
        );

        setReplyComments((prevReply) => {
          const { [commentId]: _, ...rest } = prevReply;
          return rest;
        });
      }
    } catch (error: any) {
      alert(`오류가 발생했습니다. 지속적인 오류가 발생한다면 문의해주세요!`);
    }
  };

  return (
    <div className="Delete-Modal-Background">
      <div className="Delete-Modal">
        <p>정말로 삭제하시겠습니까?</p>
        <div className="Delete-button-box">
          <button onClick={refreshPickedComment}>취소</button>
          <button onClick={deleteReviewHandler}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
