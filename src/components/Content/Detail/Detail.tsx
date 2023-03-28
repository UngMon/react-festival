import { ResponDetailCommon, ResponDetailIntro } from "../../../modules/Type";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  category: string;
  setCategory: (value: string) => void;
  contentData: {
    contentDetailCommon: ResponDetailCommon;
    contentDetailIntro: ResponDetailIntro;
  };
}

const Detail = ({ category, setCategory, contentData }: DetailProps) => {
  const detailCommon = contentData.contentDetailCommon.response.body.items.item;
  const detailIntro = contentData.contentDetailIntro.response.body.items.item;

  return (
    <div className="Content-info">
      <h1 className="Content-title">{detailCommon[0].title}</h1>
      <div className="Cotent-category">
        <div onClick={() => setCategory("기본정보")}>기본정보</div>
        <div onClick={() => setCategory("리뷰")}>리뷰</div>
        <div onClick={() => setCategory("지도")}>지도</div>
      </div>
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
