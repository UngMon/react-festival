import { Comment, PickComment, UserData } from "../../../../type/UserDataType";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { modalActions } from "../../../../redux/modal-slice";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionModal from "../modal/OptionModal";
import DeleteModal from "../modal/DeleteModal";
import ReportModal from "../modal/ReportModal";

interface T {
  origin_index: number;
  reply_index?: number;
  type: string;
  modalInfo: PickComment;
  comment_data: Comment;
  userData: UserData;
}

const CommentOption = ({
  origin_index,
  reply_index,
  type,
  modalInfo,
  comment_data,
  userData,
}: T) => {
  const dispatch = useAppDispatch();
  const reportState = useSelector((state: RootState) => state.report);
  const comment_id = comment_data.createdAt + comment_data.user_id;

  const optionClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (modalInfo.comment_id === comment_id) {
      // 같은 댓글의 옵션 버튼을 클릭할 경우, pickedComment 상태 초기화
      dispatch(modalActions.clearModalInfo({ comment_id }));
    } else {
      // 다른 댓글의 옵션 버튼을 클릭할 경우, pcikedComment 상태 갱신
      dispatch(
        modalActions.openOptionModal({
          comment_id,
          comment_data,
        })
      );
    }
  };

  return (
    <div className="option-container">
      <FontAwesomeIcon
        className="comment-option"
        onClick={(event) => optionClickHandler(event)}
        icon={faEllipsisVertical}
      />
      {modalInfo.open === comment_id && (
        <OptionModal comment_data={comment_data} userData={userData} />
      )}
      {modalInfo.delete === comment_id && (
        <DeleteModal
          modalInfo={modalInfo}
          type={type}
          origin_index={origin_index}
          reply_index={reply_index}
        />
      )}
      {reportState.open === comment_id && <ReportModal />}
    </div>
  );
};

export default CommentOption;
