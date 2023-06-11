import { useState } from "react";
import {
  ResponCommon,
  ResponInfo,
  ResponIntro,
} from "../../../type/FestivalType";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  category: string;
  contentInfo: ResponInfo;
  contentIntro: ResponIntro;
  contentCommon: ResponCommon;
  type: string;
}

const Detail = ({
  category,
  contentInfo,
  contentIntro,
  contentCommon,
  type,
}: DetailProps) => {
  const detailInfo = contentInfo.response.body.items.item;
  const detailIntro = contentIntro.response.body.items.item;
  const detailCommon = contentCommon.response.body.items.item;

  const [more, setMore] = useState<boolean>(false);
  console.log(more);
  let text: string[] = [];
  const returnTextArray = () => {
    if (!detailInfo) return;

    let infotext = "";
    let result: any = [];

    for (let i = 0; i < detailInfo.length; i++) {
      if (detailCommon[0].overview === detailInfo[i].infotext) continue;

      if (!detailInfo[i].infotext) continue;

      if (infotext === detailInfo[i].infotext) continue;

      infotext = detailInfo[i].infotext;
      result = detailInfo[i].infotext.split(/<br>|<br >|<br\/>|<br \/>/gm);
      text.push(...result);
    }
  };
  returnTextArray();

  return (
    <div className="Cotent-overview">
      <div className="overview-title">
        <strong className="o-label">제목</strong>
        <span className="o-title">{detailCommon[0].title}</span>
      </div>
      <div className="overview">
        <strong className="o-label">상세정보</strong>
        <div>
          <p dangerouslySetInnerHTML={{ __html: detailCommon[0].overview }}></p>
          {more &&
            text.map((item, index) => (
              <p className={item === `\n` ? "space" : ""} key={index}>
                {item}
              </p>
            ))}
          {text.length !== 0 && (
            <button className="more-button" onClick={() => setMore(!more)}>
              {more ? "숨기기" : "더 보기"}
            </button>
          )}
        </div>
      </div>
      <Map detailCommon={detailCommon} />
      <BasicInfo
        detailIntro={detailIntro}
        detailCommon={detailCommon}
        type={type}
      />
    </div>
  );
};

export default Detail;
