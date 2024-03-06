import { useEffect, useState } from "react";
import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
} from "../../../type/FestivalType";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import Loading from "../../loading/Loading";
import "./Detail.css";

interface DetailProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  contentId: string;
  type: string;
}

type T = {
  common: ResponCommon;
  info: ResponInfo;
  intro: ResponIntro;
};

const Detail = ({ infoRef, contentId, type }: DetailProps) => {
  const [data, setContentData] = useState<T>();
  const detailInfo = data?.info.response.body.items.item;
  const detailIntro = data?.intro.response.body.items.item;
  const detailCommon = data?.common.response.body.items.item;
  const [more, setMore] = useState<boolean>(false);

  useEffect(() => {
    const getContentData = async (type: string, contentId: string) => {
      try {
        const common = await getCotentDetailCommon(type, contentId);
        const info = await getContentInfo(type, contentId);
        const intro = await getContentDetailIntro(type, contentId);
        setContentData({ common, info, intro });
      } catch (error) {
        console.log(error);
      }
    };
    getContentData(type, contentId);
  }, [type, contentId]);

  let text: string[] = [];

  const returnTextArray = () => {
    if (!detailInfo || !detailCommon) return;

    let infotext = "";
    let result: any = [];

    for (let i = 0; i < detailInfo.length; i++) {
      if (detailCommon[0].overview === detailInfo[i].infotext) continue;

      if (!detailInfo[i].infotext) continue;

      if (infotext === detailInfo[i].infotext) continue;

      infotext = detailInfo[i].infotext;
      result = detailInfo[i].infoname + ": " + detailInfo[i].infotext;
      text.push(result);
      // console.log(detailInfo[i].infotext.split(/<br>|<br >|<br\/>|<br \/>|<strong>|<\/strong>/gm))
    }
  };
  returnTextArray();

  return (
    <div className="Cotent-overview" ref={infoRef}>
      {!detailInfo && !detailIntro && !detailCommon && (
        <div style={{ height: 500 }}>
          <Loading />
        </div>
      )}
      {detailCommon && (
        <div className="overview-title">
          <strong className="o-label">제목</strong>
          <span className="o-title">{detailCommon[0].title}</span>
        </div>
      )}
      <div className="overview">
        {detailCommon && <strong className="o-label">상세정보</strong>}
        <div className="o-p">
          {detailCommon && (
            <p
              dangerouslySetInnerHTML={{ __html: detailCommon[0].overview }}
            ></p>
          )}
          {more && detailInfo && (
            <>
              {text.map((item, index) => (
                <p
                  className={item === `\n` ? "space" : ""}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item }}
                ></p>
              ))}
              {text.length !== 0 && (
                <button className="more-button" onClick={() => setMore(!more)}>
                  {more ? "숨기기" : "더 보기"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {/* {detailCommon && <Map detailCommon={detailCommon} />} */}
      {detailIntro && detailCommon && (
        <BasicInfo
          detailIntro={detailIntro}
          detailCommon={detailCommon}
          type={type}
        />
      )}
    </div>
  );
};

export default Detail;

const serviceKey = encodeURIComponent(process.env.REACT_APP_SERVICE_KEY!);

async function getContentInfo(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailInfo1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&contentTypeId=${type}&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponInfo = await response.json();
  console.log(`info  ${JSON.stringify(data)}`);
  return data;
}

async function getContentDetailIntro(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&contentTypeId=${type}&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponIntro = await response.json();
  console.log(`Intro ${JSON.stringify(data)}`);
  return data;
}

async function getCotentDetailCommon(type: string, id: string) {
  const response = await fetch(
    `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${serviceKey}&MobileOS=ETC&MobileApp=Moa&_type=json&contentId=${id}&contentTypeId=${type}&defaultYN=Y&firstImageYN=Y&areacodeYN=N&catcodeYN=N&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch from Data");
  }

  const data: ResponCommon = await response.json();
  console.log(`common ${JSON.stringify(data)}`);
  return data;
}

// export async function loader(type: string, contentId: string) {
//   const [contentInfo, contentIntro, contentCommon] = await Promise.all([
//     getContentInfo(type, contentId!),
//     getContentDetailIntro(type, contentId!),
//     getCotentDetailCommon(type, contentId!),
//   ]);
//   return { contentInfo, contentIntro, contentCommon };
// }
