import { defer, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import {
  LoaderData,
  ResponImage,
  ResponDetailIntro,
  ResponDetailCommon,
} from "../../modules/Type";
import Slider from "./Slider";

import "./Content.css";

const Cotent = () => {
  const { contentDatailIntro, contentDetailCommon, contentImage } =
    useLoaderData() as LoaderData;

  const detailIntro = contentDatailIntro.response.body.items.item;
  const detailCommon = contentDetailCommon.response.body.items.item;
  const image = contentImage.response.body.items.item;
  console.log(detailIntro);
  console.log(detailCommon);
  console.log(image);

  return (
    <main className="main-box">
      <div className="Content">
        <Slider image={image}/>
        <div className="Content-info">
          <div className="Cotent-category">
            <div>기본정보</div>
            <div>이용안내</div>
            <div>지도</div>
          </div>
          <div className="Cotent-deatail">
            {
              <table>
                <tr key='기간'>
                  <th>기간</th>
                  <td></td>
                </tr>
                <tr key='전화번호'>
                  <th>전화번호</th>
                  <td></td>
                </tr>
                <tr key='이용요금'>
                  <th>이용요금</th>
                  <td></td>
                </tr>
                <tr key='홈페이지'>
                  <th>홈페이지</th>
                  <td></td>
                </tr>
                <tr key='주소'>
                  <th>주소</th>
                  <td></td>
                </tr>
              </table>
            }
          </div>
        </div>
        <div className="Cotent-summary">
          <strong>개요</strong>
          <p className="summary-p">{detailCommon[0].overview || '등록된 정보가 없습니다.'}</p>
        </div>
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

async function getContentDetailIntro(id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${id}&contentTypeId=15&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponDetailIntro = await response.json();
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
  return data;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const contentId = params.contentId;
  const contentImage = await getContentImage(contentId!);
  const contentDatailIntro = await getContentDetailIntro(contentId!);
  const contentDetailCommon = await getCotentDetailCommon(contentId!);
  return defer({ contentDatailIntro, contentDetailCommon, contentImage });
}
