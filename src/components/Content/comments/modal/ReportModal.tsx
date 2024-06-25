import { Report } from "../../../../type/UserDataType";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import "./ReportModal.css";

interface ReportProps {
  contentId: string;
  reportModal: Report;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
}

const ReportModal = ({
  contentId,
  reportModal,
  setReportModal,
}: ReportProps) => {

  const reportUserHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const reason = (event.target as HTMLFormElement).reason.value;

    if (reason.length === 0) return;

    const contentRef = doc(db, "reportList", contentId);

    const data = {
      why: reason,
      when: reportModal.when,
      uid: reportModal.userUid,
      name: reportModal.name,
      text: reportModal.text,
    };

    try {
      await setDoc(contentRef, { list: arrayUnion(data) }, { merge: true });
    } catch (error: any) {
      alert(error.message);
    }

    setReportModal({
      open: false,
      when: "",
      userUid: "",
      name: "",
      text: "",
    });
  };

  return (
    <div
      className="report-container"
      onClick={() =>
        setReportModal({
          open: false,
          when: "",
          userUid: "",
          name: "",
          text: "",
        })
      }
    >
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
          <button
            type="button"
            onClick={() =>
              setReportModal({
                open: false,
                when: "",
                userUid: "",
                name: "",
                text: "",
              })
            }
          >
            취소
          </button>
          <button type="submit">신고</button>
        </div>
      </form>
    </div>
  );
};

export default ReportModal;
