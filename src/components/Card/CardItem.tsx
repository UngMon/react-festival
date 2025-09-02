import { CheckParams } from "hooks/useCheckParams";
import { Item, TitleType } from "type/FetchType";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { nowDate } from "utils/nowDate";
import { DataType } from "type/DataType";
import { calculateDate } from "utils/calculateDate";
import { 지역코드, 시군코드, cat3Code } from "assets/CatCode/CatCode";
import { dateSlice } from "utils/dateSlice";
import { generatePageKey } from "utils/generatePageKey";

interface T {
  title: TitleType;
  params: CheckParams;
  numOfRows: number;
  page: number;
  tourData: DataType;
}

const CardItem = ({ params, title, tourData, numOfRows, page }: T) => {
  const navigate = useNavigate();
  const { areaCode, cat1, cat2, cat3, keyword } = params;
  const param_month = params.month;
  const { year, month, date } = nowDate();

  const NotFoundElement = (
    <div key="not-found" className="not-found-category">
      <p>
        {title === "search"
          ? "검색한 키워드 결과가 없습니다!"
          : "조건에 부합하는 결과가 없습니다!"}
      </p>
    </div>
  );

  const processedElements = useMemo(() => {
    let key: string = generatePageKey(title, params, numOfRows, page);
    const dataForPage = tourData[title][key];
    if (
      !dataForPage ||
      !dataForPage.tourData ||
      dataForPage.tourData.length === 0
    )
      return null;

    const array: Item[] = dataForPage.tourData;

    const cardClickHandler = (type: string, contentId: string) => {
      navigate(`/content?contentTypeId=${type}&contentId=${contentId}`);
    };

    const elements = array.reduce<{
      진행중: JSX.Element[];
      종료: JSX.Element[];
      시작전: JSX.Element[];
    }>(
      (acc, item) => {
        if (!item.areacode) return acc;
        if (cat1 !== "all" && cat1 !== item.cat1) return acc;
        if (cat2 !== "all" && cat2 !== item.cat2) return acc;
        if (cat3 !== "all" && cat3 !== item.cat3) return acc;

        let 축제상태 = "";
        if (title === "festival") {
          if (item.eventstartdate!.slice(4, 6) > param_month!) return acc;
          if (item.eventenddate!.slice(4, 6) < param_month!) return acc;
          if (areaCode !== "0" && areaCode !== item.areacode) return acc;

          축제상태 = calculateDate(
            item.eventstartdate!,
            item.eventenddate!,
            year,
            month,
            date
          );
        }

        const 지역 = 지역코드[item.areacode];
        const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode];
        const 지역표시 = `${지역 && `[${지역}]`} ${시군구 && `[${시군구}]`}`;

        const element = (
          <div
            className="card-item"
            key={item.contentid}
            onClick={() => cardClickHandler(item.contenttypeid, item.contentid)}
          >
            <div className="card-image-box">
              <img
                src={
                  item.firstimage?.replace(/^http:\/\//, "https://") ||
                  "../images/Noimage.png"
                }
                alt="img"
                loading="lazy"
              />
            </div>
            {title === "festival" && (
              <p className={`cal-date ${축제상태}`}>{축제상태}</p>
            )}
            <div className="card-text">
              <p className="area">{지역표시}</p>
              <h4>{item.title}</h4>
              {title === "festival" && (
                <p className="card-date">
                  {dateSlice(item.eventstartdate!, item.eventenddate!)}
                </p>
              )}
              {title !== "festival" && (
                <p className="card-tag">{`#${cat3Code[item.cat3]}`}</p>
              )}
            </div>
          </div>
        );

        if (title === "festival") {
          if (축제상태 === "진행중") acc.진행중.push(element);
          else if (축제상태 === "행사종료") acc.종료.push(element);
          else acc.시작전.push(element);
        } else acc.진행중.push(element);

        return acc;
      },
      { 진행중: [], 종료: [], 시작전: [] }
    );

    let result: JSX.Element[] = [];

    if (title === "festival") {
      if (tourData.행사상태[0]) result.push(...elements.진행중);
      if (tourData.행사상태[1]) result.push(...elements.시작전);
      if (tourData.행사상태[2]) result.push(...elements.종료);
    } else result = elements.진행중;

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourData, title, params, numOfRows, page, navigate]);

  // 데이터 자체가 아직 없을 때
  if (processedElements === null) {
    // 데이터 로딩은 성공했지만 결과가 비어있는 경우에만 "결과 없음"을 표시
    if (tourData.successGetData) return NotFoundElement;
    return null;
  }

  // 처리된 결과가 비어있을 때
  if (processedElements.length === 0) {
    return NotFoundElement;
  }

  return (
    <>
      {title === "search" && tourData.successGetData && (
        <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${processedElements.length}개`}</h3>
      )}
      {processedElements}
    </>
  );
};

export default CardItem;
