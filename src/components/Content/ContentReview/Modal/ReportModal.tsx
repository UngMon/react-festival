import { useState } from "react";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import "./ReportModal.css";

interface ReportProps {
  contentId: string;
  reportModalOpen: [boolean, string, string, string, string];
  setReportModalOpen: React.Dispatch<
    React.SetStateAction<[boolean, string, string, string, string]>
  >;
}

const ReportModal = ({
  contentId,
  reportModalOpen,
  setReportModalOpen,
}: ReportProps) => {
  const [pick, setPick] = useState<string>('');

  const reportUserHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!pick) {
      alert('신고 사유를 선택 해주세요!')
      return;
    }

    const contentRef = doc(db, "reportList", contentId);

    const reason = (event.target as HTMLFormElement).reason.value;

    const data = {
      why: reason,
      when: reportModalOpen[1],
      uid: reportModalOpen[2],
      name: reportModalOpen[3],
      text: reportModalOpen[4],
    };
    
    setPick('');
    
    try {
      await setDoc(contentRef, { list: arrayUnion(data) }, { merge: true });
      setReportModalOpen([false, "", "", "", ""]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form id="report-modal" onSubmit={reportUserHandler}>
      <div className="report-modal-title">사용자 신고</div>
      <label htmlFor="reason1">
        <input
          type="radio"
          id="reason1"
          name="reason"
          value="상업성 콘텐츠 또는 스팸"
          onClick={() => setPick("상업스팸")}
        />
        <span>상업성 콘텐츠 또는 스팸</span>
      </label>
      <label htmlFor="reason2">
        <input
          type="radio"
          id="reason2"
          name="reason"
          value="포르노 또는 음란물"
          onClick={() => setPick("포르노음란물")}
        />
        <span>음란물 또는 성희롱</span>
      </label>
      <label htmlFor="reason4">
        <input
          type="radio"
          id="reason4"
          name="reason"
          value="괴롭힘 또는 폭력/욕설"
          onClick={() => setPick("폭언욕설")}
        />
        <span>괴롭힘 또는 폭력/욕설</span>
      </label>
      <label htmlFor="reason5">
        <input
          type="radio"
          id="reason5"
          name="reason"
          value="허위 과장 정보"
          onClick={() => setPick("허위과장")}
        />
        <span>허위 과장 정보</span>
      </label>
      <div id="report-button-box">
        <button
          type="button"
          onClick={() => setReportModalOpen([false, "", "", "", ""])}
        >
          취소
        </button>
        <button type="submit">신고</button>
      </div>
    </form>
  );
};

export default ReportModal;
