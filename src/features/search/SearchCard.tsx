import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "store/store";
import { fetchTourApi } from "api/fetchTourApi";
import { CheckParams } from "hooks/useCheckParams";
import { Item } from "types/FetchType";
import { 지역코드, 시군코드, 중분류, 소분류 } from "constant/catCode";
import { createPageKey } from "utils/createPageKey";
import Loading from "common/loading/Loading";
import NoImage from "assets/etc-image/noimage.png";
import "./SearchCard.css";

interface T {
  params: CheckParams;
}

const SearchCard = ({ params }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page_key = createPageKey(50, params);

  const { datas, httpState, page_record } = useSelector(
    (state: RootState) => state.tour,
  );

  useEffect(() => {
    if (httpState === "pending" || page_record.includes(page_key)) return;

    dispatch(
      fetchTourApi({
        numOfRows: 50,
        params,
      }),
    );
  }, [dispatch, httpState, page_record, params, page_key]);

  const sigunHandler = (item: Item): string => {
    if (!item.lDongRegnCd || !item.lDongSignguCd) return "";
    const 지역 = 지역코드[item.lDongRegnCd];
    const 시군구 = 시군코드[item.lDongRegnCd][item.lDongSignguCd];
    return `${지역} ${시군구}`;
  };

  const cardClickHandler = (item: Item) => {
    const { contentid, contenttypeid } = item;
    navigate(`/content?contentTypeId=${contenttypeid}&contentId=${contentid}`);
  };

  return (
    <div className="Result-Box">
      <div className="Result-Title">
        {/* <div>{`${ContentIdCode[contentTypeId ?? "0"]}`}</div> */}
        <div></div>
      </div>
      {httpState === "pending" && <Loading height="500px" />}
      {httpState === "fulfilled" && (
        <div className="Result-Cards">
          {datas[page_key]?.tourData?.length > 0 ? (
            datas[page_key].tourData.map((item) => (
              <article
                key={item.contentid}
                onClick={() => cardClickHandler(item)}
              >
                <div className="Result-Card-Image">
                  <img
                    alt={item.title}
                    src={item.firstimage?.replace("httpss", "https") || NoImage}
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
                    {중분류[item.lclsSystm1][item.lclsSystm2] && (
                      <span>{`#${중분류[item.lclsSystm1][item.lclsSystm2]}`}</span>
                    )}
                    {소분류[item.lclsSystm2][item.lclsSystm3] && (
                      <span>{`#${소분류[item.lclsSystm2][item.lclsSystm3]}`}</span>
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

export default SearchCard;
