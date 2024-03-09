import { useEffect, useState } from "react";
import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
  GetContentData,
} from "../../../type/FestivalType";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import Loading from "../../loading/Loading";
import "./Detail.css";
import getContentData from "../../../hooks/getContentData";

interface DetailProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  contentId: string;
  type: string;
}

type Datas = {
  common: ResponCommon;
  info: ResponInfo;
  intro: ResponIntro;
};

const Detail = ({ infoRef, contentId, type }: DetailProps) => {
  const [data, setContentData] = useState<Datas>();
  const detailInfo = data?.info.response.body.items.item;
  const detailIntro = data?.intro.response.body.items.item;
  const detailCommon = data?.common.response.body.items.item;

  const [more, setMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const settingContentData = async (type: string, contentId: string) => {
      try {
        const response: GetContentData = await getContentData(type, contentId);
        setContentData({
          info: response.contentInfo,
          intro: response.contentIntro,
          common: response.contentCommon,
        });
      } catch (error: any) {
        throw Error(`error is ocurred! ${error.message}`);
      }

      setLoading(false);
    };
    settingContentData(type, contentId);
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
    }
  };
  returnTextArray();

  return (
    <div className="Cotent-text-box" ref={infoRef}>
      {loading && (
        <div style={{ height: 500 }}>
          <Loading />
        </div>
      )}
      {!loading && !detailCommon && !detailInfo && !detailIntro && (
        <div className="Content-get-error">
          데이터를 불러오는데 오류가 발생했습니다.
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
      {detailCommon && <Map detailCommon={detailCommon} />}
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
