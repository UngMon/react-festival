import { ResponDetailCommon, ResponDetailIntro } from "../../../type/Type";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  category: string;
  contentData: {
    contentDetailCommon: ResponDetailCommon;
    contentDetailIntro: ResponDetailIntro;
  };
}

const Detail = ({
  category,
  contentData,
}: DetailProps) => {
  const detailCommon = contentData.contentDetailCommon.response.body.items.item;
  const detailIntro = contentData.contentDetailIntro.response.body.items.item;

  return (
    <div className="Content-info">
      <div className="Cotent-deatail">
        {category === "기본정보" && (
          <BasicInfo detailIntro={detailIntro} detailCommon={detailCommon} />
        )}
        {category === "지도" && <Map detailCommon={detailCommon} />}
      </div>
    </div>
  );
};

export default Detail;
