import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "store/store";
import { fetchTourApi } from "api/fetchTourApi";
import { CheckParams } from "hooks/useCheckParams";
import { Item, TitleType } from "type/FetchType";
import {
  지역코드,
  시군코드,
  cat2Code,
  cat3Code,
  ContentIdCode,
} from "assets/CatCode/CatCode";
import "./ResultCard.css";
import Loading from "components/Loading/Loading";

interface T {
  title: TitleType;
  params: CheckParams;
  page: number;
}

const ResultCard = ({ title, params, page }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tourData = useSelector((state: RootState) => state.data);
  const { contentTypeId, keyword } = params;
  const page_key = `${contentTypeId}-${keyword}-${page}`;

  useEffect(() => {
    switch (true) {
      case !ContentIdCode[contentTypeId!]:
        navigate("/");
        return;
      case tourData.httpState === "pending":
        return;
      case tourData.httpState === "fulfilled":
        return;
      case tourData.search[page_key].tourData.length > 0:
        return;
    }

    dispatch(
      fetchTourApi({
        numOfRows: 25,
        page,
        title,
        params,
      })
    );
  }, [
    dispatch,
    navigate,
    tourData,
    title,
    page,
    params,
    contentTypeId,
    page_key,
  ]);

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

  return (
    <div className="Result-Box">
      <div className="Result-Title">
        <div>{`${ContentIdCode[contentTypeId ?? "0"]}`}</div>
        <div></div>
      </div>
      {tourData.httpState === "pending" && <Loading height="500px" />}
      {tourData.httpState === "fulfilled" && (
        <div className="Result-Cards">
          {tourData.search[page_key].tourData?.length > 0 ? (
            tourData.search[page_key].tourData?.map((item, index) => (
              <article
                key={item.contenttypeid}
                onClick={() => cardClickHandler(item)}
              >
                <div className="Result-Card-Image">
                  <img
                    alt={item.title}
                    src={
                      item.firstimage?.replace("http", "https") ||
                      "/images/Noimage.png"
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
