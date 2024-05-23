import { Report } from "../../type/Firebase";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import ContentReviews from "./contentReview/ContentReviews";
import MenuBar from "./contentInfo/MenuBar";
import ReportModal from "./contentReview/modal/ReportModal";
import "./Content.css";

const Cotent = () => {
  const [category, setCategory] = useState<string>("기본정보");
  const [reportModal, setReportModal] = useState<Report>({
    open: false,
    when: "",
    userUid: "",
    name: "",
    text: "",
  });

  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const type: string = param.get("type")!;
  const contentId: string = param.get("contentId")!;

  return (
    <main className="Content">
      {reportModal.open && (
        <ReportModal
          contentId={param.get("contentId")!}
          reportModal={reportModal}
          setReportModal={setReportModal}
        />
      )}
      <Slider type={type} contentId={contentId} />
      <MenuBar
        category={category}
        setCategory={setCategory}
        infoRef={infoRef}
        reviewRef={reviewRef}
      />
      <Detail infoRef={infoRef} contentId={contentId} type={type} />
      <ContentReviews
        type={type}
        contentId={contentId}
        reviewRef={reviewRef}
        setReportModal={setReportModal}
      />
    </main>
  );
};

export default Cotent;
