import { useNavigate } from "react-router-dom";
import { DataType } from "../../../type/DataType";
import {
  Item,
  지역코드,
  시군코드,
  cat2Code,
  cat3Code,
} from "../../../type/FetchType";
import "./ResultCard.css";
import Loading from "../../loading/Loading";

interface T {
  idkey: string;
  tourData: DataType;
  contentTypeId?: string;
  ContentIdCode: Record<string, string>;
}

const ResultCard = ({ idkey, ContentIdCode, contentTypeId, tourData }: T) => {
  const navigate = useNavigate();

  const sigunHandler = (item: Item): string => {
    if (!item.areacode || !item.sigungucode) return "";
    const 지역 = 지역코드[item.areacode];
    const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode];
    return `${지역} ${시군구}`;
  };

  const cardClickHandler = (item: Item) => {
    const { contentid, contenttypeid } = item;
    navigate(`/content?contentTypeId=${contenttypeid}&contentId=${contentid}`);
  };
  console.log(tourData.httpState);
  return (
    <div className="Result-Box">
      <div className="Result-Title">
        <div>{`${ContentIdCode[contentTypeId ?? "0"]}`}</div>
        <div></div>
      </div>
      {tourData.httpState === "pending" && <Loading height="500px" />}
      {tourData.httpState === "fulfilled" && (
        <div className="Result-Cards">
          {tourData.search[idkey] ? (
            tourData.search[idkey].map((item, index) => (
              <article key={index} onClick={() => cardClickHandler(item)}>
                <div className="Result-Card-Image">
                  <img
                    alt={item.title}
                    src={
                      item.firstimage?.replace("http", "https") ||
                      "../images/Noimage.png"
                    }
                    loading="lazy"
                  />
                </div>
                <div className="Result-Card-Content">
                  <div className="Result-Card-Title">
                    <span>{item.title}</span>
                  </div>
                  <div className="Result-Card-Sigun">
                    <span>{sigunHandler(item)}</span>
                  </div>
                  <div className="Result-Card-Hash">
                    {ContentIdCode[item.contenttypeid] && (
                      <span>{`#${ContentIdCode[item.contenttypeid]}`}</span>
                    )}
                    {cat2Code[item.cat2] && (
                      <span>{`#${cat2Code[item.cat2]}`}</span>
                    )}
                    {cat3Code[item.cat3] && (
                      <span>{`#${cat3Code[item.cat3]}`}</span>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="search-not-found">검색 결과가 없습니다!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
