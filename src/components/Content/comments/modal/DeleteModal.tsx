import { useEffect } from "react";
import { Comment, PickComment } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import "./DeleteModal.css";

interface DeleteProps {
  item: Comment;
  originIndex: number;
  replyIndex?: number;
  index: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
}

const DeleteModal = ({
  item,
  originIndex,
  replyIndex,
  setComments,
  setPickedComment,
  setReplyComments,
}: DeleteProps) => {
  const refreshPickedComment = () => {
    setPickedComment((prevState) => {
      const { [item.createdAt + item.uid]: remove, ...rest } = prevState;
      return { ...rest } as PickComment;
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
    const deleteDocRef = doc(db, "comments", item.createdAt + "U" + item.uid);

    // 고려 사항
    // 1. 댓글을 삭제할지 대댓글을 삭제하는지에 대한 구분이 필요
    // => originIndex, replyIndex로 구분합니다.

    // 2. 해당 글의 좋아요 싫어요와 관련된 데이터를 어떻게 수정할 것인지 고민필요.

    // const DeleteCommentRef = doc(
    //   db,
    //   collectionName,
    //   contentId,
    //   "comment",
    //   createdAt + "=" + uid
    // );

    // const DeleteUserDataRef = doc(
    //   db,
    //   "userData",
    //   uid,
    //   "comments",
    //   createdAt + "=" + uid
    // );

    // const batch = writeBatch(db);

    refreshPickedComment();
    try {
      await deleteDoc(deleteDocRef);

      if (replyIndex) {
        setReplyComments((prevReply) => ({
          ...prevReply,
          [item.createdAt + item.uid]: [
            ...prevReply[item.createdAt + item.uid].slice(0, replyIndex),
            ...prevReply[item.createdAt + item.uid].slice(replyIndex + 1),
          ],
        }));
      } else {
        setComments((prevComments) => [
          ...prevComments.slice(0, originIndex),
          ...prevComments.slice(originIndex + 1),
        ]);
      }

      // batch.delete(DeleteCommentRef);
      // batch.delete(DeleteUserDataRef);
      // await batch.commit();
      //       setComments((prevComments) => {
      //         if (replyIndex) {
      //          const [item] = prevComments[originIndex].replies!;

      //          return [...prevComments.slice(originIndex + 1)]

      //         } else {
      //           return [
      //             ...prevComments.slice(0, originIndex),
      //             ...prevComments.slice(originIndex + 1),
      //           ]
      //         }
      // });
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
