import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "store/store";
import { fetchTourApi } from "api/fetchTourApi";
import { CheckParams } from "hooks/useCheckParams";
import { Item, TourDataType } from "types/FetchType";
import {
  지역코드,
  시군코드,
  중분류,
  소분류,
  ContentIdCode,
} from "constant/catCode";
import { createPageKey } from "utils/createPageKey";
import Loading from "common/loading/Loading";
import "./SearchCard.css";

interface T {
  tourDataType: TourDataType;
  params: CheckParams;
  page: number;
}

const SearchCard = ({ tourDataType, params, page }: T) => {
  const { contentTypeId } = params;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const page_key = createPageKey(tourDataType, 50, params);
  const searchDatas = useSelector(
    (state: RootState) => state.data.datas[tourDataType]?.[page_key],
  );
  const httpState = useSelector((state: RootState) => state.data.httpState);
  const page_record = useSelector((state: RootState) => state.data.page_record);

  useEffect(() => {
    switch (true) {
      case params.requireRedirect !== "":
        navigate(params.requireRedirect);
        return;
      case httpState === "pending":
        return;
      case page_record.some((item) => item.previous_page_key === page_key):
        return;
    }

    dispatch(
      fetchTourApi({
        numOfRows: 25,
        page,
        tourDataType,
        params,
      }),
    );
  }, [
    dispatch,
    navigate,
    httpState,
    page_record,
    tourDataType,
    page,
    params,
    contentTypeId,
    page_key,
  ]);

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
        <div>{`${ContentIdCode[contentTypeId ?? "0"]}`}</div>
        <div></div>
      </div>
      {httpState === "pending" && <Loading height="500px" />}
      {httpState === "fulfilled" && (
        <div className="Result-Cards">
          {searchDatas?.tourData?.length > 0 ? (
            searchDatas.tourData.map((item) => (
              <article
                key={item.contentid}
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
