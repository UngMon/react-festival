import { useRef, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import {
  LoaderData,
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../modules/Type";
import Slider from "./Slider";
import Detail from "./Detail/Detail";
import "./Content.css";
import Review from "./Review/Review";
import Overview from "./Overview";

const Cotent = () => {
  console.log("content render");
  const { contentId } = useParams();
  const { contentDetailIntro, contentDetailCommon, contentImage } =
    useLoaderData() as LoaderData;

  const [category, setCategory] = useState<string>("기본정보");
  const contentData = { contentDetailIntro, contentDetailCommon };

  const reviewRef = useRef<HTMLDivElement>(null);

  return (
    <main className="main-box">
      <div className="Content">
        <Slider contentImage={contentImage} />
        <Detail
          category={category}
          setCategory={setCategory}
          contentData={contentData}
          reviewRef={reviewRef}
        />
        <Overview contentDetailCommon={contentDetailCommon} />
      </div>
      <Review contentId={contentId!} reviewRef={reviewRef}/>
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

export async function loader({ params }: LoaderFunctionArgs) {
  console.log("loader work");
  const contentId = params.contentId;
  const [contentImage, contentDetailIntro, contentDetailCommon] =
    await Promise.all([
      getContentImage(contentId!),
      getContentDetailIntro(contentId!),
      getCotentDetailCommon(contentId!),
    ]);
  return { contentDetailIntro, contentDetailCommon, contentImage };
}
