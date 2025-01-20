import { useEffect } from "react";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { reportActions } from "../../../../redux/report-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./ReportModal.css";

const ReportModal = () => {
  const dispatch = useAppDispatch();
  const reportState = useSelector((state: RootState) => state.report);
  const report_reason = reportState.report_reason;
  const clearSetState = () => dispatch(reportActions.setClearState());

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSetState();
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  });

  const reportUserHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(reportState.report_reason).length === 0)
      return alert("신고 사유를 선택해주세요!");

    const { open: _, ...rest } = reportState;
    const contentRef = doc(db, "reportList", reportState.content_id);

    try {
      await setDoc(contentRef, { list: arrayUnion(rest) }, { merge: true });
    } catch (error: any) {
      alert(error.message);
    }
    clearSetState();
  };

  const listClickHandler = (category: string) => {
    dispatch(reportActions.checkList({ category }));
  };

  return (
    <div className="report-container" onClick={clearSetState}>
      <form
        className="report-form"
        onSubmit={reportUserHandler}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="report-title">
          <span>사용자 신고</span>
        </div>
        <div className="report-cancel">
          <button type="button" onClick={clearSetState}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <ul>
          <li onClick={() => listClickHandler("스펨/상업")}>
            <div
              className={`check-box ${
                report_reason["스펨/상업"] ? "checked" : ""
              }`}
            >
              <FontAwesomeIcon icon={faSquareCheck} />
            </div>
            <div>
              <span>상업성 콘텐츠 또는 스팸</span>
            </div>
          </li>
          <li onClick={() => listClickHandler("포르노/음란물")}>
            <div
              className={`check-box ${
                report_reason["포르노/음란물"] ? "checked" : ""
              }`}
            >
              <FontAwesomeIcon icon={faSquareCheck} />
            </div>
            <div>
              <span>포르노 또는 음란물</span>
            </div>
          </li>
          <li onClick={() => listClickHandler("괴롭힘/폭력/욕설")}>
            <div
              className={`check-box ${
                report_reason["괴롭힘/폭력/욕설"] ? "checked" : ""
              }`}
            >
              <FontAwesomeIcon icon={faSquareCheck} />
            </div>
            <div>
              <span>괴롭힘 또는 폭력/욕설</span>
            </div>
          </li>
          <li onClick={() => listClickHandler("허위/과장")}>
            <div
              className={`check-box ${
                report_reason["허위/과장"] ? "checked" : ""
              }`}
            >
              <FontAwesomeIcon icon={faSquareCheck} />
            </div>
            <div>
              <span>허위 과장 정보</span>
            </div>
          </li>
        </ul>
        <div className="report-button-box">
          <button type="submit">제출</button>
        </div>
      </form>
    </div>
  );
};

export default ReportModal;
