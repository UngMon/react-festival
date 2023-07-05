import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
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

interface Props {
  title: string;
  target: React.RefObject<HTMLDivElement>;
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

const AnotherCard = ({ title, target }: Props) => {
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
  const key =
    title === "result"
      ? "result"
      : type === "12"
      ? "tour"
      : type === "14"
      ? "culture"
      : "travel";

  const [record, setRecord] = useState<
    [string, string, string, string, string]
  >([type, areaCode, cat1, cat2, cat3]);
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
        type === tourData.serchRecord[0] &&
        keyword === tourData.serchRecord[1] &&
        tourData.serchRecord[2] === "complete"
      ) {
        // console.log("결과 complted");
        return;
      }

      if (!target.isIntersecting && isIntersecting) {
        // console.log("감지 x");
        setIsIntersecting(false);
      }

      if (target.isIntersecting && !isIntersecting) {
        // console.log("감지");
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

    if (
      record[0] !== type ||
      record[1] !== areaCode ||
      record[2] !== cat1 ||
      record[3] !== cat2 ||
      record[4] !== cat3
    ) {
      setPage([1, 1, false]);
      setRecord([type, areaCode, cat1, cat2, cat3]);
      return;
    }

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
    } else {
      data = tourData[key]?.[areaCode]?.[cat1]?.[cat2]?.[cat3] || [];
    }

    if (!isIntersecting && tourData.dataRecord[title]) return;

    if (data.length === 0) {
      !page[2] && setPage([page[0], page[0], true]);
      !page[2] && dispatch(getTCTRData(parameter));
    } else if (
      data.length < 50 * page[0] &&
      page[0] > page[1] &&
      tourData.dataRecord[title] !== "complete"
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
    } else {
      array = tourData[key]?.[areaCode]?.[cat1]?.[cat2]?.[cat3];
      if (!array) return;
    }

    // console.log(`return result ${array.length}`);

    for (let item of array) {
      if (!item.areacode) continue;

      if (cat1 !== "all" && cat1 !== item.cat1) continue;

      if (cat2 !== "all" && cat2 !== item.cat2) continue;

      if (cat3 !== "all" && cat3 !== item.cat3) continue;

      if (title !== "festival" && !item.firstimage) continue;

      if (title === "festival") {
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

    return returnArray.length === 0 ? (
      <div className="not-found-category">
        <p>조건에 부합하는 결과가 없습니다!</p>
      </div>
    ) : (
      returnArray
    );
  };

  return (
    <>
      {/* <h3 className="result-title">{`' ${keywo rd} ' 검색 결과: ${tcts.result['0'].length}개`}</h3> */}
      {returnResult()}
      {tourData.loading && <Loading />}
      {title !== "trend" && !tourData.loading && !tourData.successGetData && (
        <GetDataError />
      )}
    </>
  );
};

export default AnotherCard;
