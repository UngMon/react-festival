import { useEffect } from "react";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/store";
import { reportActions } from "../../../../redux/report-slice";
import "./ReportModal.css";

const ReportModal = () => {
  const dispatch = useAppDispatch();
  const reportState = useSelector((state: RootState) => state.report);

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
    const reason = (e.target as HTMLFormElement).reason.value;

    if (reason.length === 0) return;

    const { open: _, ...rest } = reportState;
    const contentRef = doc(db, "reportList", reportState.content_id);

    try {
      await setDoc(contentRef, { list: arrayUnion(rest) }, { merge: true });
    } catch (error: any) {
      alert(error.message);
    }
    clearSetState();
  };

  return (
    <>
      {reportState.open && (
        <div className="report-container" onClick={clearSetState}>
          <form
            id="report-modal"
            onSubmit={reportUserHandler}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-title">사용자 신고</div>
            <label htmlFor="reason1">
              <input
                type="radio"
                id="reason1"
                name="reason"
                value="상업성 콘텐츠 또는 스팸"
              />
              <span>상업성 콘텐츠 또는 스팸</span>
            </label>
            <label htmlFor="reason2">
              <input
                type="radio"
                id="reason2"
                name="reason"
                value="포르노 또는 음란물"
              />
              <span>음란물 또는 성희롱</span>
            </label>
            <label htmlFor="reason4">
              <input
                type="radio"
                id="reason4"
                name="reason"
                value="괴롭힘 또는 폭력/욕설"
              />
              <span>괴롭힘 또는 폭력/욕설</span>
            </label>
            <label htmlFor="reason5">
              <input
                type="radio"
                id="reason5"
                name="reason"
                value="허위 과장 정보"
              />
              <span>허위 과장 정보</span>
            </label>
            <div id="report-button-box">
              <button type="button" onClick={clearSetState}>
                취소
              </button>
              <button type="submit">신고</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ReportModal;
