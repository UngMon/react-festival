import { CheckParams } from "hooks/useCheckParams";
import { Item, TourDataType } from "type/FetchType";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import { nowDate } from "utils/nowDate";
import { calculateDate } from "utils/calculateDate";
import { 지역코드, 시군코드, cat3Code } from "assets/CatCode/CatCode";
import { dateSlice } from "utils/dateSlice";

type Card = {
  data: Item;
  _state: string;
};

interface T {
  tourDataType: TourDataType;
  params: CheckParams;
  numOfRows: number;
  page: number;
  tourDataArray: Item[];
}

const CardItem = ({ params, tourDataType, tourDataArray }: T) => {
  console.log("Card Item");
  const navigate = useNavigate();
  const 행사상태 = useSelector((state: RootState) => state.data.행사상태);
  const { areaCode, cat1, cat2, cat3, keyword, month: param_month } = params;
  const { year, month, date } = nowDate();

  // url에 맞는 관광공사 데이터가 없다면 아래 요소 반환
  if (tourDataArray.length === 0)
    return (
      <div key="not-found" className="not-found-category">
        <p>
          {tourDataType === "search"
            ? "검색한 키워드 결과가 없습니다!"
            : "조건에 부합하는 결과가 없습니다!"}
        </p>
      </div>
    );

  const filteredItems = () => {
    let result: Card[] = [];

    const filteredData = tourDataArray.reduce<{
      진행중: Card[];
      종료: Card[];
      시작전: Card[];
    }>(
      (acc, item) => {
        if (!item.areacode) return acc;
        if (cat1 !== "all" && cat1 !== item.cat1) return acc;
        if (cat2 !== "all" && cat2 !== item.cat2) return acc;
        if (cat3 !== "all" && cat3 !== item.cat3) return acc;

        if (tourDataType === "festival") {
          if (item.eventstartdate!.slice(4, 6) > param_month!) return acc;
          if (item.eventenddate!.slice(4, 6) < param_month!) return acc;
          if (areaCode !== "0" && areaCode !== item.areacode) return acc;

          let 축제상태 = calculateDate(
            item.eventstartdate!,
            item.eventenddate!,
            year,
            month,
            date
          );

          if (축제상태 === "진행중")
            acc.진행중.push({ data: item, _state: 축제상태 });
          else if (축제상태 === "행사종료")
            acc.종료.push({ data: item, _state: 축제상태 });
          else acc.시작전.push({ data: item, _state: 축제상태 });
        } else acc.진행중.push({ data: item, _state: "진행중" });

        return acc;
      },
      { 진행중: [], 종료: [], 시작전: [] }
    );

    if (tourDataType === "festival") {
      if (행사상태[0]) result.push(...filteredData.진행중);
      if (행사상태[1]) result.push(...filteredData.시작전);
      if (행사상태[2]) result.push(...filteredData.종료);
    } else result = filteredData.진행중;

    return result;
  };

  const datas = filteredItems();

  return (
    <>
      {tourDataType === "search" && (
        <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${datas.length}개`}</h3>
      )}
      {datas.map((item) => {
        const {
          areacode,
          contentid,
          contenttypeid,
          sigungucode,
          firstimage,
          eventstartdate,
          eventenddate,
          title,
          cat3,
        } = item.data;
        const 축제상태 = item._state;

        const 지역 = 지역코드[areacode];
        const 시군구 = 시군코드[지역코드[areacode]][sigungucode];
        const 지역표시 = `${지역 && `[${지역}]`} ${시군구 && `[${시군구}]`}`;

        return (
          <div
            className="card-item"
            key={contentid}
            onClick={() =>
              navigate(
                `/content?contentTypeId=${contenttypeid}&contentId=${contentid}`
              )
            }
          >
            <div className="card-image-box">
              <img
                src={
                  firstimage?.replace(/^http:\/\//, "https://") ||
                  "../images/Noimage.png"
                }
                alt="img"
                loading="lazy"
              />
            </div>
            {tourDataType === "festival" && (
              <p className={`cal-date ${축제상태}`}>{축제상태}</p>
            )}
            <div className="card-text">
              <p className="area">{지역표시}</p>
              <h4>{title}</h4>
              {tourDataType === "festival" ? (
                <p className="card-date">
                  {dateSlice(eventstartdate!, eventenddate!)}
                </p>
              ) : (
                <p className="card-tag">{`#${cat3Code[cat3]}`}</p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardItem;
