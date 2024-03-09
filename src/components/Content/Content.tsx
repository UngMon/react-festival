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
  const [reportModalOpen, setReportModalOpen] = useState<
    [boolean, string, string, string, string]
  >([false, "", "", "", ""]);

  const infoRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  const [param] = useSearchParams();
  const type: string = param.get("type")!;
  const contentId: string = param.get("contentId")!;

  return (
    <main className="Content-box">
      <div className="Content">
        {reportModalOpen[0] && (
          <ReportModal
            contentId={param.get("contentId")!}
            reportModalOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
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
        {/* <ContentReviews
          contentId={contentId}
          reviewRef={reviewRef}
          setReportModalOpen={setReportModalOpen}
        /> */}
      </div>
    </main>
  );
};

export default Cotent;
