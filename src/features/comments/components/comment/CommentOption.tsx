import { CommentType } from "types/DataType";
import { useSelector } from "react-redux";
import { modalActions } from "store/modal-slice";
import { RootState, useAppDispatch } from "store/store";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionModal from "../modal/OptionModal";
import DeleteModal from "../modal/DeleteModal";
import ReportModal from "../modal/ReportModal";

interface T {
  role: string;
  comment_data: CommentType;
}

const CommentOption = ({ role, comment_data }: T) => {
  const dispatch = useAppDispatch();
  const comment_id = comment_data.createdAt + comment_data.user_id;

  const isOpenOption = useSelector(
    (state: RootState) => state.modal.openOption === comment_id,
  );
  const isOpenDelete = useSelector(
    (state: RootState) => state.modal.openDelete === comment_id,
  );
  const isOpenReport = useSelector(
    (state: RootState) => state.modal.openReport === comment_id,
  );

  const optionClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOpenOption) {
      // 이미 내 옵션창이 열려있는데 다시 클릭한 경우 -> 닫기
      dispatch(modalActions.toggleToastModal({}));
    } else {
      // 닫혀있거나 다른 댓글의 옵션이 열려있는 경우 -> 내 옵션창 열기
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
      {isOpenOption && (
        <OptionModal
          comment_id={comment_id}
          comment_user_id={comment_data.user_id}
        />
      )}
      {isOpenDelete && <DeleteModal role={role} comment_data={comment_data} />}
      {isOpenReport && <ReportModal comment_data={comment_data} />}
    </div>
  );
};

export default CommentOption;
