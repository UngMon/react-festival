import { CommentType } from "type/DataType";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { modalActions } from "store/modal-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./ReportModal.css";

interface T {
  comment_data: CommentType;
}

const report_array = [
  "상업성 콘텐츠 또는 스팸",
  "포르노 또는 음란물",
  "괴롭힘 또는 폭력/욕설",
  "허위 과장 정보",
];

const ReportModal = ({ comment_data }: T) => {
  const dispatch = useAppDispatch();
  const [report_reason, setReportReason] = useState<string>("");
  const { current_user_id, current_user_name } = useSelector(
    (state: RootState) => state.firebase
  );

  const clickCancelHandler = () => {
    dispatch(modalActions.clearModalInfo({}));
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clickCancelHandler();
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  const reportUserHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (report_reason === "") return alert("신고 사유를 선택해주세요!");

    const report_time = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    const contentRef = doc(db, "reportList", report_time + current_user_id);
    const {
      content_type,
      content_id,
      content_title,
      text,
      user_id,
      user_name,
      createdAt,
    } = comment_data;

    try {
      await setDoc(contentRef, {
        content_type,
        content_id,
        content_title,
        createdAt,
        text,
        report_reason,
        reported_id: user_id,
        reported_name: user_name,
        reporter_id: current_user_id,
        reporter_name: current_user_name,
        report_time,
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      clickCancelHandler();
    }
  };

  return (
    <div className="report-container" onClick={clickCancelHandler}>
      <form
        className="report-form"
        onSubmit={reportUserHandler}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="report-title">
          <span>사용자 신고</span>
        </div>
        <div className="report-cancel">
          <button type="button" onClick={clickCancelHandler}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <ul>
          {report_array.map((item) => (
            <li key={item} onClick={() => setReportReason(item)}>
              <div
                className={`check-box ${
                  report_reason === item ? "checked" : ""
                }`}
              >
                <FontAwesomeIcon icon={faSquareCheck} />
              </div>
              <div>
                <span>{item}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="report-button-box">
          <button type="submit">제출</button>
        </div>
      </form>
    </div>
  );
};

export default ReportModal;
