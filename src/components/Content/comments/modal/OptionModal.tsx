import React from "react";
import { Comment } from "../../../../type/UserDataType";
import { Report } from "../../../../type/UserDataType";

interface T {
  item: Comment;
  userUid: string;
  setOpenOption: React.Dispatch<React.SetStateAction<boolean>>;
  setReviseReview: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDelete: (value: React.SetStateAction<boolean>) => void;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
}

const OptionModal = ({
  item,
  userUid,
  setOpenOption,
  setReviseReview,
  setOpenDelete,
  setReportModal,
}: T) => {
  const reviseButtonHandler = (itemUid: string) => {
    if (itemUid !== userUid) return;
    setOpenOption(false);
    setReviseReview(true);
  };

  return (
    <>
      <div className="option-box">
        {item.uid === userUid && (
          <p
            className="option-revise"
            onClick={() => reviseButtonHandler(item.uid)}
          >
            수정
          </p>
        )}
        {item.uid === userUid && (
          <p
            className="option-delete"
            onClick={() => {
              setOpenDelete(true);
              setOpenOption(false);
            }}
          >
            삭제
          </p>
        )}
        {item.uid !== userUid && (
          <p
            onClick={() =>
              setReportModal({
                open: true,
                when: item.when,
                userUid: item.uid,
                name: item.name,
                text: item.text,
              })
            }
          >
            신고
          </p>
        )}
      </div>
    </>
  );
};

export default OptionModal;
