import { useCallback, useEffect, useState, useRef } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { getTCTRData } from "../../redux/fetch-action";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { Item, 지역코드, 시군코드, tagName } from "../../type/Common";
import { datas } from "../../data";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dateSlice } from "../../utils/DateSlice";
import Loading from "../loading/Loading";
import GetDataError from "../error/GetDataError";
import "./Card.css";

interface CardProps {
  title: string;
}

const areaCodeArr = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
];

const Card = ({ title }: CardProps) => {
  const target = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const naviagate = useNavigate();

  const [params] = useSearchParams();
  const type = params.get("type")!;
  const areaCode = params.get("areaCode")! || "0";
  const pickMonth = params.get("month") || "";
  const cat1: string = params.get("cat1") || "all";
  const cat2: string = params.get("cat2") || "all";
  const cat3: string = params.get("cat3") || "all";
  const keyword = params.get("keyword") || "";
  const key = type === "12" ? "tour" : type === "14" ? "culture" : "travel";

  const [record, setRecord] = useState<
    [string, string, string, string, string, string]
  >([type, areaCode, cat1, cat2, cat3, ""]);
  const [page, setPage] = useState<[number, number, boolean]>([1, 1, false]);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const tourData = useSelector((state: RootState) => state.tourApi);

  useEffect(() => {
    let ref = target.current!;

    const options = {
      root: null, // 타켓 요소가 "어디에" 들어왔을때 콜백함수를 실행할 것인지 결정합니다. null이면 viewport가 root로 지정됩니다.
      //root: document.querySelector('#scrollArea'), => 특정 요소를 선택할 수도 있습니다.
      rootMargin: "0px", // root에 마진값을 주어 범위를 확장 가능합니다.
      threshold: 1.0, // 타겟 요소가 얼마나 들어왔을때 콜백함수를 실행할 것인지 결정합니다. 1이면 타겟 요소 전체가 들어와야 합니다.
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (tourData.loading) return;

      let target = entries[0];

      // 검색 결과물에서 모든 데이터를 불러온 경우 tcts.saerchRecord[2] === 'complete'
      // 이때, 다른 검색을 한 경우에 다시 페이지를 불러와야 하므로 아래와 같이 비교식을 작성
      if (
        title === "result" &&
        tourData.serchRecord[keyword][type] === "complete"
      )
        return;

      if (!target.isIntersecting && isIntersecting) {
        setIsIntersecting(false);
      }

      if (target.isIntersecting && !isIntersecting) {
        setIsIntersecting(true);
        setPage([page[0] + 1, page[0], false]);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => callback(entries),
      options
    );

    observer.observe(ref);

    return () => observer.unobserve(ref);
  });

  useEffect(() => {
    // trend는이미 데이터가 있음.
    if (title === "trend") return;
    // 데이터를 받아오는 과정에서 불 필요한 렌더링 없애기 위함
    if (tourData.loading) return;
    // 만약 사용자가 url의 region의 값을 '120'과 같이 수정하면 return;
    if (!areaCodeArr.includes(areaCode)) return;

    if (!isIntersecting && tourData.dataRecord[title]) return;

    if (
      record[0] !== type ||
      record[1] !== areaCode ||
      record[2] !== cat1 ||
      record[3] !== cat2 ||
      record[4] !== cat3 ||
      record[5] !== keyword
    ) {
      setPage([1, 1, false]);
      setRecord([type, areaCode, cat1, cat2, cat3, keyword]);
      return;
    }

    if (tourData.serchRecord?.[keyword]?.[type] === "complete") {
      return;
    }

    //다른 areacode일 경우, page = [1, 1, false]로 업데이트 되기전에 아래 비동기 fetch가 작동한다.
    //그렇게 되면 page[2, 2, false]와 같이 리셋 되지 않은 page 상태가 전돨되므로 boolean으로 차단

    const parameter = {
      type,
      title,
      areaCode,
      cat1,
      cat2,
      cat3,
      page,
      keyword,
    };

    let data: any;

    if (title === "festival") {
      data = tourData["festival"];
    } else if (title === "result") {
      data = tourData.result?.[keyword]?.[type] || [];
      if (data.length === 0) {
        dispatch(getTCTRData(parameter));
        setPage([page[0], page[0], false]);
      } else if (
        data.length < page[0] * 50 &&
        page[0] > page[1] &&
        isIntersecting &&
        tourData.serchRecord[keyword][type] !== "complete"
      ) {
        dispatch(getTCTRData(parameter));
        setPage([page[0], page[0], false]);
      }
      return;
    } else {
      data = tourData[key]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] || [];
    }

    if (data.length === 0) {
      !page[2] && setPage([page[0], page[0], true]);
      !page[2] && dispatch(getTCTRData(parameter));
    } else if (
      data.length < 50 * page[0] &&
      page[0] > page[1] &&
      tourData.dataRecord[type][areaCode][cat1][cat2][cat3] !== "complete"
    ) {
      setPage([page[0], page[0], false]);
      dispatch(getTCTRData(parameter));
    }
  }, [
    dispatch,
    tourData,
    page,
    record,
    type,
    title,
    areaCode,
    cat1,
    cat2,
    cat3,
    key,
    keyword,
    isIntersecting,
  ]);

  const cardClickHandler = useCallback(
    (type: string, contentId: string) => {
      dispatch(firebaseActions.cardClicked());
      naviagate(`/content/search?type=${type}&contentId=${contentId}`);
    },
    [dispatch, naviagate]
  );

  const returnResult = () => {
    let array: Item[] = [];
    let result: JSX.Element[] = [];
    let returnArray: JSX.Element[] = [];
    let 행사종료: JSX.Element[] = [];
    let 행사중: JSX.Element[] = [];
    let 행사시작전: JSX.Element[] = [];

    const { year, month, date } = nowDate();

    if (title === "trend") array = datas[type];
    else if (title === "festival") {
      array = tourData.festival;
      if (array.length === 0) return;
    } else if (title === "result") {
      array = tourData.result?.[keyword]?.[type] || [];
      if (array.length === 0 && tourData.loading) return;
    } else {
      array = tourData[key]?.[areaCode]?.[cat1]?.[cat2]?.[cat3];
      if (!array) return;
    }

    for (let item of array) {
      if (!item.areacode) continue;

      if (cat1 !== "all" && cat1 !== item.cat1) continue;

      if (cat2 !== "all" && cat2 !== item.cat2) continue;

      if (cat3 !== "all" && cat3 !== item.cat3) continue;

      if (title !== "festival" && !item.firstimage) continue;

      if (title === "festival") {
        if (item.eventstartdate!.slice(4, 6) > pickMonth) continue;
        if (item.eventenddate!.slice(4, 6) < pickMonth) continue;
        if (areaCode !== "0" && areaCode !== item.areacode) continue;
      }

      let 행사상태 = "";

      if (title === "festival") {
        행사상태 = calculateDate(
          item.eventstartdate!,
          item.eventenddate!,
          year,
          month,
          date
        );
        if (행사상태 === "진행중") {
          if (!tourData.행사상태[0]) continue;
        } else if (행사상태 === "행사종료") {
          if (!tourData.행사상태[2]) continue;
        } else {
          if (!tourData.행사상태[1]) continue;
        }
      }

      const 지역 = 지역코드[item.areacode] || "";
      const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode] || "";
      const 지역표시 = `${지역 && `[${지역}]`} ${시군구 && `[${시군구}]`}`;

      const element = (
        <div
          className="card-item"
          key={item.title + `${Math.random()}`}
          onClick={() => cardClickHandler(item.contenttypeid, item.contentid)}
        >
          <div className="tour-image-box">
            <img
              className="card-image"
              src={
                item.firstimage.replace("http", "https") ||
                "../images/Noimage.png"
              }
              alt={"img"}
              loading={"lazy"}
            ></img>
          </div>
          {title === "festival" && (
            <p
              className={`cal-date ${
                행사상태 === "진행중"
                  ? "ing"
                  : 행사상태 === "행사종료"
                  ? "end"
                  : "aft"
              }`}
            >
              {행사상태}
            </p>
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
              <p className="card-tag">{`#${tagName[item.cat3]}`}</p>
            )}
          </div>
        </div>
      );

      if (title === "festival") {
        if (행사상태 === "행사종료") {
          행사종료.push(element);
          continue;
        } else if (행사상태 === "진행중") {
          행사중.push(element);
          continue;
        } else {
          행사시작전.push(element);
        }
      } else {
        result.push(element);
      }
    }

    if (title !== "festival") returnArray = result;
    else returnArray = [...행사중, ...행사시작전, ...행사종료];

    return (
      <>
        {title === "result" && !tourData.loading && tourData.successGetData && (
          <h3 className="result-title">{`' ${keyword} ' 검색 결과: ${returnArray.length}개`}</h3>
        )}
        {returnArray.length === 0 ? (
          <div className="not-found-category">
            <p>
              {title === "result"
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
    <article className={`main-box-content ${title === "result" && "result"}`}>
      <div className="AllView-grid-box">
        {returnResult()}
        {tourData.loading && <Loading />}
        {title !== "trend" && !tourData.loading && !tourData.successGetData && (
          <GetDataError />
        )}
      </div>
      <div ref={target}></div>
    </article>
  );
};

export default Card;
