import { Suspense, useEffect, useRef, useState } from "react";
import {
  Await,
  LoaderFunctionArgs,
  defer,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router-dom";
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
import ReportModal from "./contentReview/modal/ReportModal";
import Loading from "../ui/Loading";
import "./Content.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Data = {
  contentDetailIntro: ResponDetailIntro;
  contentDetailCommon: ResponDetailCommon;
  contentImage: ResponImage;
};

const Cotent = () => {
  console.log("content render");
  const { contentId } = useParams();
  const navigation = useNavigation();
  console.log(navigation);
  const [contentData, setContentData] = useState<Data>();
  // const { contentDetailIntro, contentDetailCommon, contentImage } =
  //   useLoaderData() as LoaderData;
  // const stat = useSelector((state: RootState) => state.content)

  const [category, setCategory] = useState<string>("기본정보");
  const [reportModalOpen, setReportModalOpen] = useState<
    [boolean, string, string, string, string]
  >([false, "", "", "", ""]);

  // const contentData = { contentDetailIntro, contentDetailCommon };
  const menuBarRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  // console.log(navigation)
  console.log(contentData);
  useEffect(() => {
    const getContentData = async (contentId: string) => {
      try {
        const data = await loader(contentId!);
        setContentData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getContentData(contentId!);
  }, [contentId]);

  return (
    <main className="Content-box">
      {reportModalOpen[0] && (
        <ReportModal
          contentId={contentId!}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
        />
      )}
      <h2 className="Content-title">
        {!contentData
          ? "불러오는중..."
          : contentData!.contentDetailCommon.response.body.items.item[0].title}
      </h2>
      <div className="Content">
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
            />
          )}
        </div>
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
  console.log("getContentImage work");
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
  console.log("loader getContentDetailIntro");
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
  console.log("loader getDetailCommon");
  return data;
}

export async function loader(contentId: string) {
  // { params }: LoaderFunctionArgs
  console.log("loader work");
  // const contentId = params.contentId;
  const [contentImage, contentDetailIntro, contentDetailCommon] =
    await Promise.all([
      getContentImage(contentId!),
      getContentDetailIntro(contentId!),
      getCotentDetailCommon(contentId!),
    ]);
  // const contentDetailCommon = getCotentDetailCommon(contentId!);
  // const contentDetailIntro = getContentDetailIntro(contentId!);
  // const contentImage = await getContentImage(contentId!);
  // return defer({
  //   contentDetailCommon: getCotentDetailCommon(contentId!),
  //   contentDetailIntro: getContentDetailIntro(contentId!),
  //   contentImage: getContentImage(contentId!),
  // });
  // console.log("loader work");
  return { contentDetailIntro, contentDetailCommon, contentImage };
}
