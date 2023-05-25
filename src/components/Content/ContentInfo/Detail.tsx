import {
  ResponDetailCommon,
  ResponDetailIntro,
} from "../../../type/FestivalType";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  category: string;
  contentDetailCommon: ResponDetailCommon;
  contentDetailIntro: ResponDetailIntro;
  type: string;
}

const Detail = ({
  category,
  contentDetailCommon,
  contentDetailIntro,
  type,
}: DetailProps) => {
  const detailCommon = contentDetailCommon.response.body.items.item;
  const detailIntro = contentDetailIntro.response.body.items.item;

  return (
    <>
      <div className="Content-info">
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
        <div className="Cotent-deatail">
          {category === "기본정보" && (
            <BasicInfo
              detailIntro={detailIntro}
              detailCommon={detailCommon}
              type={type}
            />
          )}
          {category === "지도" && <Map detailCommon={detailCommon} />}
        </div>
      </div>
    </>
  );
};

export default Detail;
