import { Suspense, useState } from "react";
import {
  Await,
  defer,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import {
  LoaderData,
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../modules/Type";
import Slider from "./Slider";
import Detail from "./Detail";
import "./Content.css";
import Review from "./Review";
import Overview from "./Overview";
import Loading from "../UI/Loading";

const Cotent = () => {
  console.log("content render");
  const { contentDatailIntro, contentDetailCommon, contentImage } =
    useLoaderData() as LoaderData;
  const [category, setCategory] = useState<string>("기본정보");
  // const detailIntro = contentDatailIntro.response.body.items.item;
  // const detailCommon = contentDetailCommon.response.body.items.item;
  // const image = contentImage.response.body.items.item;
  // console.log(detailIntro);
  // console.log(detailCommon);
  // console.log(image);

  return (
    <main className="main-box">
      {/* <h1 className="Content-title">{detailCommon[0].title}</h1> */}
      <div className="Content">
        <Suspense fallback={<Loading />}>
          <Await resolve={contentImage}>
            {(loadedCotentImage) => <Slider contentImage={loadedCotentImage} />}
          </Await>
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Await resolve={{ contentDetailCommon, contentDatailIntro }}>
            {(loadedCotentData) => (
              <Detail
                setCategory={setCategory}
                contentData={loadedCotentData}
              />
            )}
          </Await>
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Await resolve={contentDetailCommon}>
            {(loadedDetailCommon) => (
              <Overview contentDetailCommon={loadedDetailCommon} />
            )}
          </Await>
        </Suspense>
      </div>
      <Review />
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
    `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=15&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=N&overviewYN=Y&numOfRows=10&pageNo=1`
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
  const contentImage = getContentImage(contentId!);
  const contentDatailIntro = await getContentDetailIntro(contentId!);
  const contentDetailCommon = await getCotentDetailCommon(contentId!);
  return defer({ contentDatailIntro, contentDetailCommon, contentImage });
}
