import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../type/FestivalType";
import Slider from "./contentImages/Slider";
import Detail from "./contentInfo/Detail";
import ContentReviews from "./contentReview/ContentReviews";
import MenuBar from "./contentInfo/MenuBar";
import ReportModal from "./contentReview/modal/ReportModal";
import Loading from "../ui/loading/Loading";
import "./Content.css";

type Data = {
  contentDetailIntro: ResponDetailIntro;
  contentDetailCommon: ResponDetailCommon;
  contentImage: ResponImage;
};

const Cotent = () => {
  const [param] = useSearchParams();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [contentData, setContentData] = useState<Data>();
  // console.log(contentData);
  // console.log('content')
  const [category, setCategory] = useState<string>("기본정보");
  const [reportModalOpen, setReportModalOpen] = useState<
    [boolean, string, string, string, string]
  >([false, "", "", "", ""]);

  const menuBarRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) return;

    const getContentData = async (type: string, contentId: string) => {
      try {
        const data = await loader(type, contentId!);
        setContentData(data);
      } catch (error) {
        console.log(error);
      }
    };
    setLoading(false);
    getContentData(param.get("type")!, param.get("contentId")!);
  }, [param, isLoading]);

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
        <h2 className="Content-title">
          {contentData &&
            contentData!.contentDetailCommon.response.body.items.item[0].title}
        </h2>
        <div className="slider-container">
          {!contentData && <Loading />}
          {contentData && <Slider contentImage={contentData.contentImage} />}
        </div>
        {contentData && (
          <MenuBar
            category={category}
            setCategory={setCategory}
            menuBarRef={menuBarRef}
            reviewRef={reviewRef}
          />
        )}
        <div className="Content-detatil-area" ref={menuBarRef}>
          {!contentData && (
            <div style={{ height: 500 }}>
              <Loading />
            </div>
          )}
          {contentData && (
            <Detail
              category={category}
              contentDetailCommon={contentData.contentDetailCommon}
              contentDetailIntro={contentData.contentDetailIntro}
              type={param.get("type")!}
            />
          )}
        </div>
        <ContentReviews
          contentId={param.get("contentId")!}
          reviewRef={reviewRef}
          setReportModalOpen={setReportModalOpen}
        />
      </div>
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

  return data;
}

async function getContentDetailIntro(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=${type}&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailIntro = await response.json();
  return data;
}

async function getCotentDetailCommon(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=${type}&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailCommon = await response.json();

  return data;
}

export async function loader(type: string, contentId: string) {
  // { params }: LoaderFunctionArgs
  // console.log("loader work");
  // const contentId = params.contentId;
  const [contentImage, contentDetailIntro, contentDetailCommon] =
    await Promise.all([
      getContentImage(contentId!),
      getContentDetailIntro(type, contentId!),
      getCotentDetailCommon(type, contentId!),
    ]);
  // console.log(contentImage, contentDetailIntro, contentDetailCommon);
  return { contentDetailIntro, contentDetailCommon, contentImage };
}
