import { ResponDetailCommon, ResponDetailIntro } from "../../../modules/Type";
import BasicInfo from "./BasicInfo";
import Map from "./Map";
import "./Detail.css";

interface DetailProps {
  reviewRef: React.RefObject<HTMLDivElement>;
  category: string;
  setCategory: (value: string) => void;
  contentData: {
    contentDetailCommon: ResponDetailCommon;
    contentDetailIntro: ResponDetailIntro;
  };
}

const Detail = ({
  reviewRef,
  category,
  setCategory,
  contentData,
}: DetailProps) => {
  const detailCommon = contentData.contentDetailCommon.response.body.items.item;
  const detailIntro = contentData.contentDetailIntro.response.body.items.item;

  const reviewClickHandler = () => {
    if (reviewRef.current) {
      reviewRef.current!.scrollIntoView({ behavior: 'smooth'});
    }
  };

  return (
    <div className="Content-info">
      <h1 className="Content-title">{detailCommon[0].title}</h1>

      <ul className="Cotent-category">
        <li>
          <button onClick={() => setCategory("기본정보")}>기본정보</button>
        </li>
        <li>
          <button onClick={reviewClickHandler}>리뷰</button>
        </li>
        <li>
          <button onClick={() => setCategory("지도")}>지도</button>
        </li>
      </ul>

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
