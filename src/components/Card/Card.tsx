import { useCallback, useEffect, useMemo } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { CheckParams } from "../../hooks/useCheckParams";
import { getTourApiData } from "../../redux/fetch-action";
import { useNavigate } from "react-router-dom";
import {
  Item,
  지역코드,
  시군코드,
  cat3Code,
  TitleType,
} from "../../type/FetchType";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dateSlice } from "../../utils/DateSlice";
import Loading from "../loading/Loading";
import GetDataError from "../error/GetDataError";
import "./Card.css";

interface CardProps {
  title: TitleType;
  numOfRows: number;
  page: number;
  params: CheckParams;
}

const Card = ({ title, numOfRows, page, params }: CardProps) => {
  console.log("Card Render");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tourData = useSelector((state: RootState) => state.data);

  useEffect(() => {
    let key: string = "";
    const { contentTypeId, areaCode, cat1, cat2, cat3, keyword } =
      params as CheckParams;

    switch (true) {
      case params.requireRedirect !== "":
        navigate(params.requireRedirect);
        return;
      case tourData.httpState === "pending":
        return;
      case tourData.httpState === "fulfilled" && !tourData.successGetData:
        return;
      case title === "festival":
        if (tourData.festival.data) return;
        break;
      default:
        if (title === "search") key = `${contentTypeId}-${keyword}-${page}`;
        else
          key = `${contentTypeId}-${numOfRows}-${page}-${areaCode}-${cat1}-${cat2}-${cat3}`;

        if (tourData.cat_record.includes(key)) return;
    }

    key = `${contentTypeId}-${areaCode}-${cat1}-${cat2}-${cat3}`;

    dispatch(
      getTourApiData({
        existPageInfo: tourData.cat_page_record[key] ? true : false,
        numOfRows,
        page,
        title,
        params: params as CheckParams,
      })
    );
  }, [dispatch, navigate, page, params, numOfRows, tourData, title]);

  const cardClickHandler = useCallback(
    (type: string, contentId: string) => {
      navigate(`/content?contentTypeId=${type}&contentId=${contentId}`);
    },
    [navigate]
  );

  const returnResult = useMemo(() => {
    if (params.requireRedirect !== "" || tourData.loading) return null;
    const { contentTypeId, areaCode, cat1, cat2, cat3, keyword } =
      params as CheckParams;
    const paramMonth = params.month;

    let array: Item[] = [];
    let key: string = "";

    switch (title) {
      case "festival":
        key = "data";
        array = tourData.festival[key];
        break;
      case "search":
        key = `${keyword}-${contentTypeId}-${numOfRows}-${page}`;
        array = tourData.search[key];
        break;
      default:
        key = `${contentTypeId}-${numOfRows}-${page}-${areaCode}-${cat1}-${cat2}-${cat3}`;
        array = tourData[title][key];
    }

    // 빈 배열에서 불 필요한 작업 생략
    if (!array || array.length === 0) return;

    const { year, month, date } = nowDate();

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
        // if (!item.firstimage) return acc;

        let 축제상태 = "";
        if (title === "festival") {
          if (item.eventstartdate!.slice(4, 6) > paramMonth!) return acc;
          if (item.eventenddate!.slice(4, 6) < paramMonth!) return acc;
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
                  item.firstimage?.replace("http", "https") ||
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

    return (
      <>
        {title === "search" && tourData.successGetData && (
          <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${result.length}개`}</h3>
        )}
        {result.length === 0 ? (
          <div className="not-found-category">
            <p>
              {title === "search"
                ? "검색한 키워드 결과가 없습니다!"
                : "조건에 부합하는 결과가 없습니다!"}
            </p>
          </div>
        ) : (
          result
        )}
      </>
    );
  }, [cardClickHandler, params, title, tourData, numOfRows, page]);

  return (
    <article className={`main-box-content ${title === "search" && "result"}`}>
      <div className="AllView-grid-box">
        {returnResult}
        {tourData.loading && <Loading height="500px" />}
        {!tourData.loading && !tourData.successGetData && <GetDataError />}
      </div>
    </article>
  );
};

export default Card;
