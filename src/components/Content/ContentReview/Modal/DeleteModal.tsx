import { Comment } from "../../../../type/UserData";
import {
  updateDoc,
  arrayRemove,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import "./DeleteModal.css";

interface DeleteProps {
  contentRef: DocumentReference<DocumentData>;
  reviewArray: Comment[];
  setReviewArray: React.Dispatch<React.SetStateAction<Comment[]>>;
  openDelete: [boolean, number];
  setOpenDelete: React.Dispatch<React.SetStateAction<[boolean, number]>>;
}

const DeleteModal = ({
  contentRef,
  reviewArray,
  setReviewArray,
  openDelete,
  setOpenDelete,
}: DeleteProps) => {
  const deleteReviewHandler = async (index: number) => {
    try {
      updateDoc(contentRef, { comment: arrayRemove(reviewArray[index]) });
      setReviewArray([
        ...reviewArray.slice(0, index),
        ...reviewArray.slice(index + 1),
      ]);
      setOpenDelete([false, 0]);
      console.log('Delete comment')
    } catch (error: any) {
      console.log(error.message);
      alert(`오류가 발생했습니다. 지속적인 오류가 발생한다면 문의해주세요!`);
    }
  };

  return (
    <div className="Delete-Modal-Background">
      <div className="Delete-Modal">
        <p>정말로 삭제하시겠습니까?</p>
        <div className="Delete-button-box">
          <button onClick={() => setOpenDelete([false, 0])}>취소</button>
          <button onClick={() => deleteReviewHandler(openDelete[1])}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
