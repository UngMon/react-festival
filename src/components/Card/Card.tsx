import { useCallback, useEffect, useState, useRef } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { getApiData } from "../../redux/fetch-action";
import { useNavigate } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { Item, 지역코드, 시군코드, tagName } from "../../type/Common";
import { datas } from "../../data";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dateSlice } from "../../utils/DateSlice";
import Loading from "../loading/Loading";
import GetDataError from "../error/GetDataError";
import useAllParams from "../hooks/useAllParams";
import "./Card.css";

interface CardProps {
  title: string;
}

const titleObject: { [key: string]: "tour" | "culture" | "travel" } = {
  "12": "tour",
  "14": "culture",
  "25": "travel",
};

// const areaCodeArr = [
//   "0",
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "31",
//   "32",
//   "33",
//   "34",
//   "35",
//   "36",
//   "37",
//   "38",
//   "39",
// ];

const Card = ({ title }: CardProps) => {
  const target = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = useAllParams(title);
  const { type, areaCode, cat1, cat2, cat3, keyword, url } = params;

  const cotentType = titleObject[type];

  const [mount, setMount] = useState<boolean>(true);
  const [page, setPage] = useState<[number, number, string]>([1, 1, title]);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const tourData = useSelector((state: RootState) => state.data);

  useEffect(() => {
    let ref = target.current!;

    const options = {
      root: null, // 타켓 요소가 "어디에" 들어왔을때 콜백함수를 실행할 것인지 결정합니다. null이면 viewport가 root로 지정됩니다.
      //root: document.querySelector('#scrollArea'), => 특정 요소를 선택할 수도 있습니다.
      rootMargin: "0px", // root에 마진값을 주어 범위를 확장 가능합니다.
      threshold: 1.0, // 타겟 요소가 얼마나 들어왔을때 콜백함수를 실행할 것인지 결정합니다. 1이면 타겟 요소 전체가 들어와야 합니다.
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      /* 
      축제 데이터는 한 번에 불러오기 때문에 observer를 통해서 추가적인 데이터 요청을 하지 않아도 된다. 
      */

      if (tourData.loading) return;

      if (title === "festival" && tourData.dataRecord) return;

      let target = entries[0];

      if (!target.isIntersecting && isIntersecting) {
        setIsIntersecting(false);
      }

      if (target.isIntersecting && !isIntersecting) {
        setIsIntersecting(true);
        setPage(page[2] !== title ? [1, 1, title] : [page[0], page[0], title]);
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
    /*
      1. title = 'trend'의 경우, 이미 데이터가 존재하므로 Http 통신을 할 필요가 없다.
      2. tourData.loading = true이면 get 요청중이므로 중복된 Http 통신을 방지한다.
      3. title = 'result'는 사용자가 검색을 한 경우인데, serchRecord.keyword.type의 value가 
      'complete'라면 모든 데이터를 불러온 경우다. 따라서 불 필요한 Http 통신을 방지한다.
      4. 검색 이외의 관광지, 문화시설, 축제, 여행코스경우 dataRecrod.type,areaCode.... = 'complete'
      3번에서와 같이 불필요한 통신을 방지한다.
    */
    if (url.length !== 0) {
      if (url === "locallhost:3000") navigate("/");
      else navigate(url);
      return;
    }

    if (title === "trend" || tourData.loading) return;

    if (
      tourData.httpState === "fulfilled" &&
      !tourData.loading &&
      !tourData.successGetData
    )
      return;

    if (tourData.serchRecord?.[keyword]?.[type] === "complete") return;

    if (
      title !== "festival" &&
      tourData.dataRecord?.[type]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] ===
        "complete"
    )
      return;

    /* 아래 parameter는 fetch 'get'메소드에 필요한 매개변수이다. */
    const parameter = {
      type,
      title,
      areaCode,
      cat1,
      cat2,
      cat3,
      page: String(page[0]),
      keyword,
    };

    let data: any;

    /* data의 길이가 0이라면 첫 마운트에서 tourData State의 값이다. 
      아래 코드에서는 data의 길이가 0 이거나 IntersectionObserver가 작동하는 순간에
      각 컨텐츠의 데이터를 요청한다.
    */
    switch (title) {
      case "festival":
        data = tourData["festival"];
        break;
      case "result":
        data = tourData.result?.[keyword]?.[type] || [];
        break;
      default: // tour, culture, travel
        data = tourData[cotentType]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] || [];
    }

    if (mount || isIntersecting || data.length === 0) {
      dispatch(getApiData(parameter));
      setIsIntersecting(false);
      setPage([page[0], page[0], title]);
      setMount(false);
    }
  }, [
    dispatch,
    tourData,
    page,
    type,
    title,
    areaCode,
    cat1,
    cat2,
    cat3,
    cotentType,
    keyword,
    isIntersecting,
    mount,
    navigate,
    url,
  ]);

  const cardClickHandler = useCallback(
    (type: string, contentId: string) => {
      dispatch(firebaseActions.cardClicked());
      navigate(`/content/search?type=${type}&contentId=${contentId}`);
    },
    [dispatch, navigate]
  );

  /*
   ***************** JSX *****************
   아래 returnResult 함수는 JSX.Element를 반환한다.
   여러 조건식 때문에 map메소드로 표한하기에는 한계가 있어
   for문을 사용했다.
   */

  const returnResult = () => {
    let array: Item[] = [];

    switch (title) {
      case "trend":
        array = datas[type];
        break;
      case "festival":
        array = tourData.festival;
        break;
      case "result":
        array = tourData.result?.[keyword!]?.[type] ?? [];
        break;
      default:
        array = tourData[cotentType]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] ?? [];
    }

    if (array.length === 0) return; // 빈 배열에서 불 필요한 연산 생략

    let result: JSX.Element[] = [];
    let returnArray: JSX.Element[] = [];
    let 행사종료: JSX.Element[] = [];
    let 행사중: JSX.Element[] = [];
    let 행사시작전: JSX.Element[] = [];
    const { year, month, date } = nowDate();

    for (let item of array) {
      if (!item.areacode) continue;
      if (cat1 !== "all" && cat1 !== item.cat1) continue;
      if (cat2 !== "all" && cat2 !== item.cat2) continue;
      if (cat3 !== "all" && cat3 !== item.cat3) continue;
      if (title !== "festival" && !item.firstimage) continue;

      let 축제상태 = "";

      if (title === "festival") {
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
        if (축제상태 === "행사종료") 행사종료.push(element);
        else if (축제상태 === "진행중") 행사중.push(element);
        else 행사시작전.push(element);
      } else {
        result.push(element);
      }
    } // for end

    if (title !== "festival") returnArray = result;
    else returnArray = [...행사중, ...행사시작전, ...행사종료];

    return (
      <>
        {title === "result" && tourData.successGetData && (
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
