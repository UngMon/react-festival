import { Comment } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import "./DeleteModal.css";

interface DeleteProps {
  when: string;
  uid: string;
  index: number;
  collectionName: string;
  contentId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal = ({
  when,
  uid,
  index,
  collectionName,
  contentId,
  comments,
  setComments,
  setOpenDelete,
}: DeleteProps) => {

  const deleteReviewHandler = async () => {
    const commentRef = doc(
      db,
      collectionName,
      contentId,
      "comment",
      when + "=" + uid
    );

    try {
      const newCommentArray = [...comments];
      newCommentArray.splice(index, 1);
      setComments(newCommentArray);
      setOpenDelete(false);
      await deleteDoc(commentRef);
    } catch (error: any) {
      alert(`오류가 발생했습니다. 지속적인 오류가 발생한다면 문의해주세요!`);
    }
  };

  return (
    <div className="Delete-Modal-Background">
      <div className="Delete-Modal">
        <p>정말로 삭제하시겠습니까?</p>
        <div className="Delete-button-box">
          <button onClick={() => setOpenDelete(false)}>취소</button>
          <button onClick={deleteReviewHandler}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
