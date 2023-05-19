import { ResponDetailCommon, ResponDetailIntro } from "../../../type/FestivalType";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  category: string;
  contentDetailCommon: ResponDetailCommon;
  contentDetailIntro: ResponDetailIntro;

}

const Detail = ({
  category,
  contentDetailCommon,
  contentDetailIntro,
}: DetailProps) => {

  const detailCommon = contentDetailCommon.response.body.items.item;
  const detailIntro = contentDetailIntro.response.body.items.item;

  return (
    <>
      <div className="Content-info">
        <div className="Cotent-deatail">
          {category === "기본정보" && (
            <BasicInfo detailIntro={detailIntro} detailCommon={detailCommon} />
          )}
          {category === "지도" && <Map detailCommon={detailCommon} />}
        </div>
      </div>
      <div className="Cotent-overview">
        <strong>개요</strong>
        <div className="overview-p">
          <p
            dangerouslySetInnerHTML={{
              __html: detailCommon[0].overview || "등록된 정보가 없습니다.",
            }}
          ></p>
        </div>
      </div>
    </>
  );
};

export default Detail;
