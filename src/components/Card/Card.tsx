import { useCallback, useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { getTourApiData } from "../../redux/fetch-action";
import { useNavigate } from "react-router-dom";
import { Item, 지역코드, 시군코드, cat3Code, Data } from "../../type/Common";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dateSlice } from "../../utils/DateSlice";
import Loading from "../loading/Loading";
import GetDataError from "../error/GetDataError";
import useAllParams from "../../hooks/useAllParams";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import "./Card.css";

interface CardProps {
  title:
    | "관광지"
    | "문화시설"
    | "여행코스"
    | "검색"
    | "축제/공연/행사"
    | "레포츠";
}

const titleObject: {
  [key: string]: "관광지" | "문화시설" | "여행코스" | "레포츠";
} = {
  "12": "관광지",
  "14": "문화시설",
  "25": "여행코스",
  "28": "레포츠",
};

const Card = ({ title }: CardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    contentTypeId,
    month,
    areaCode,
    cat1,
    cat2,
    cat3,
    keyword,
    requireRedirect,
  } = useAllParams(title);

  const cotentType = titleObject[contentTypeId];
  const tourData = useSelector((state: RootState) => state.data);

  const [targetRef, intersecting, setIntersecting] = useIntersectionObserver(
    tourData.loading
  );

  useEffect(() => {
    switch (true) {
      case requireRedirect !== "":
        navigate(requireRedirect);
        return;
      case !intersecting || tourData.httpState === "pending":
        return;
      case title === "축제/공연/행사" &&
        tourData["축제/공연/행사"].length !== 0:
        return;
      // case title === "검색" &&
      //   tourData.serchRecord?.[keyword]?.[type] === "complete":
      //   return;
      case tourData.dataRecord?.[contentTypeId]?.[areaCode]?.[cat1]?.[cat2]?.[
        cat3
      ] === "complete":
        return;
    }
    console.log("USEEFFECT PASS");
    const result = tourData.검색[keyword]?.[contentTypeId];
    let d = tourData[title] as Data;
    const data = d[areaCode]?.[cat1]?.[cat2]?.[cat3];
    const pageNumber = title === "검색" ? result : data;
    const parameter = {
      contentTypeId,
      title,
      areaCode,
      cat1,
      cat2,
      cat3,
      page: String((pageNumber || []).length / 50 + 1),
      keyword,
    };

    dispatch(getTourApiData(parameter));
    setIntersecting(false);
  }, [
    dispatch,
    navigate,
    setIntersecting,
    requireRedirect,
    areaCode,
    cat1,
    cat2,
    cat3,
    keyword,
    contentTypeId,
    intersecting,
    tourData,
    title,
  ]);

  const cardClickHandler = useCallback(
    (type: string, contentId: string) => {
      navigate(`/content/search?type=${type}&contentId=${contentId}`);
    },
    [navigate]
  );

  const returnResult = () => {
    let array: Item[] = [];

    switch (title) {
      case "축제/공연/행사":
        array = tourData["축제/공연/행사"];
        break;
      // case "검색":
      //   array = tourData.result?.[keyword]?.["0"] ?? [];
      //   break;
      default:
        array = tourData[cotentType]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] ?? [];
    }

    if (array.length === 0) return; // 빈 배열에서 불 필요한 연산 생략}

    let result: JSX.Element[] = [];
    let returnArray: JSX.Element[] = [];
    let 행사종료: JSX.Element[] = [];
    let 행사중: JSX.Element[] = [];
    let 행사시작전: JSX.Element[] = [];
    const { year, date } = nowDate();

    for (let item of array) {
      if (!item.areacode) continue;
      if (cat1 !== "all" && cat1 !== item.cat1) continue;
      if (cat2 !== "all" && cat2 !== item.cat2) continue;
      if (cat3 !== "all" && cat3 !== item.cat3) continue;
      if (title !== "축제/공연/행사" && !item.firstimage) continue;

      let 축제상태 = "";

      if (title === "축제/공연/행사") {
        if (item.eventstartdate!.slice(4, 6) > month) continue;
        if (item.eventenddate!.slice(4, 6) < month) continue;
        if (areaCode !== "0" && areaCode !== item.areacode) continue;

        축제상태 = calculateDate(
          item.eventstartdate!,
          item.eventenddate!,
          year,
          month,
          date
        );

        if (축제상태 === "진행중") {
          if (!tourData.행사상태[0]) continue;
        } else if (축제상태 === "행사종료") {
          if (!tourData.행사상태[2]) continue;
        } else {
          if (!tourData.행사상태[1]) continue;
        }
      }

      const 지역 = 지역코드[item.areacode];
      const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode];
      const 지역표시 = `${지역 && `[${지역}]`} ${시군구 && `[${시군구}]`}`;
      const element = (
        <div
          className="card-item"
          key={item.title + `${Math.random()}`}
          onClick={() => cardClickHandler(item.contenttypeid, item.contentid)}
        >
          <div className="card-image-box">
            <img
              src={
                item.firstimage.replace("http", "https") ||
                "../images/Noimage.png"
              }
              alt={"img"}
              loading={"lazy"}
            ></img>
          </div>
          {title === "축제/공연/행사" && (
            <p
              className={`cal-date ${
                축제상태 === "진행중"
                  ? "ing"
                  : 축제상태 === "행사종료"
                  ? "end"
                  : "aft"
              }`}
            >
              {축제상태}
            </p>
          )}
          <div className="card-text">
            <p className="area">{지역표시}</p>
            <h4>{item.title}</h4>
            {title === "축제/공연/행사" && (
              <p className="card-date">
                {dateSlice(item.eventstartdate!, item.eventenddate!)}
              </p>
            )}
            {title !== "축제/공연/행사" && (
              <p className="card-tag">{`#${cat3Code[item.cat3]}`}</p>
            )}
          </div>
        </div>
      );
      if (title === "축제/공연/행사") {
        if (축제상태 === "행사종료") 행사종료.push(element);
        else if (축제상태 === "진행중") 행사중.push(element);
        else 행사시작전.push(element);
      } else {
        result.push(element);
      }
    } // for end

    if (title !== "축제/공연/행사") returnArray = result;
    else returnArray = [...행사중, ...행사시작전, ...행사종료];

    return (
      <>
        {/* {title === "검색" && tourData.successGetData && (
          <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${returnArray.length}개`}</h3>
        )} */}
        {returnArray.length === 0 ? (
          <div className="not-found-category">
            <p>
              {title === "검색"
                ? "검색한 키워드 결과가 없습니다!"
                : "조건에 부합하는 결과가 없습니다!"}
            </p>
          </div>
        ) : (
          returnArray
        )}
      </>
    );
  };

  return (
    <article className={`main-box-content ${title === "검색" && "result"}`}>
      <div className="AllView-grid-box">
        {returnResult()}
        {tourData.loading && <Loading />}
        {!tourData.loading && !tourData.successGetData && <GetDataError />}
      </div>
      <div ref={targetRef}></div>
    </article>
  );
};

export default Card;
