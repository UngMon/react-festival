import { CommentType } from "../../../../type/DataType";
import { useSelector } from "react-redux";
import { modalActions } from "store/modal-slice";
import { RootState, useAppDispatch } from "../../../../store/store";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionModal from "../Modal/OptionModal";
import DeleteModal from "../Modal/DeleteModal";
import ReportModal from "../Modal/ReportModal";

interface T {
  type: string;
  comment_data: CommentType;
}

const CommentOption = ({ type, comment_data }: T) => {
  const dispatch = useAppDispatch();
  const comment_id = comment_data.createdAt + comment_data.user_id;

  const openOption = useSelector((state: RootState) => state.modal.openOption);
  const openDelete = useSelector((state: RootState) => state.modal.openDelete);
  const openReport = useSelector((state: RootState) => state.modal.openReport);
  const current_id = useSelector((state: RootState) => state.modal.current_id);

  const optionClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (current_id === comment_id) {
      // 같은 댓글의 옵션 버튼을 클릭할 경우, pickedComment 상태 초기화
      dispatch(modalActions.clearModalInfo({ comment_id }));
    } else {
      // 다른 댓글의 옵션 버튼을 클릭할 경우, pcikedComment 상태 갱신
      dispatch(modalActions.openOptionModal({ comment_id }));
    }
  };

  return (
    <div className="option-container">
      <FontAwesomeIcon
        className="comment-option"
        onClick={(event) => optionClickHandler(event)}
        icon={faEllipsisVertical}
      />
      {openOption === comment_id && (
        <OptionModal
          comment_id={comment_id}
          comment_user_id={comment_data.user_id}
          // userData={userData}
        />
      )}
      {openDelete === comment_id && (
        <DeleteModal
          type={type}
          comment_data={comment_data}
          // modalInfo={modalInfo}
        />
      )}
      {openReport === comment_id && <ReportModal comment_data={comment_data} />}
    </div>
  );
};

export default CommentOption;
