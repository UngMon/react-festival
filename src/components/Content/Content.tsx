import { useRef, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import {
  LoaderData,
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../type/Type";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import ContentReviews from "./contentReview/ContentReviews";
import Overview from "./contentInfo/Overview";
import MenuBar from "./contentInfo/MenuBar";
import "./Content.css";
import ReportModal from "./contentReview/modal/ReportModal";

const Cotent = () => {
  const { contentId } = useParams();
  const { contentDetailIntro, contentDetailCommon, contentImage } =
    useLoaderData() as LoaderData;

  const [category, setCategory] = useState<string>("기본정보");
  const [reportModalOpen, setReportModalOpen] = useState<
    [boolean, string, string, string, string]
  >([false, "", "", "", ""]);

  const contentData = { contentDetailIntro, contentDetailCommon };
  const menuBarRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  return (
    <main className="main-box">
      {reportModalOpen[0] && (
        <ReportModal
          contentId={contentId!}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )}
      <div className="Content">
        <Slider contentImage={contentImage} />
        <h1 className="Content-title" ref={menuBarRef}>
          {contentData.contentDetailCommon.response.body.items.item[0].title}
        </h1>
        <MenuBar
          category={category}
          setCategory={setCategory}
          menuBarRef={menuBarRef}
          reviewRef={reviewRef}
        />
        <Detail category={category} contentData={contentData} />
        <Overview contentDetailCommon={contentDetailCommon} />
      </div>
      <ContentReviews
        contentId={contentId!}
        reviewRef={reviewRef}
        setReportModalOpen={setReportModalOpen}
      />
    </main>
  );
};

export default Cotent;
const serviceKey = encodeURIComponent(process.env.REACT_APP_SERVICE_KEY!);

async function getContentImage(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&imageYN=Y&subImageYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }
  const data: ResponImage = await response.json();
  // console.log("getContentImage work");
  return data;
}

async function getContentDetailIntro(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=15&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailIntro = await response.json();
  // console.log("loader getContentDetailIntro");
  return data;
}

async function getCotentDetailCommon(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailCommon = await response.json();
  // console.log("loader getDetailCommon");
  return data;
}

export async function loader({ params }: LoaderFunctionArgs) {
  // console.log("loader work");
  const contentId = params.contentId;
  const [contentImage, contentDetailIntro, contentDetailCommon] =
    await Promise.all([
      getContentImage(contentId!),
      getContentDetailIntro(contentId!),
      getCotentDetailCommon(contentId!),
    ]);
  return { contentDetailIntro, contentDetailCommon, contentImage };
}
