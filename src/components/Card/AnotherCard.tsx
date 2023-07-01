import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { getTCTRData } from "../../redux/fetch-action";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { Item, 지역코드, 시군코드, tagName } from "../../type/Common";
import { datas } from "../../data";
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
  const keyword = params.get("keyword") || "";
  const key =
    title === "result"
      ? "result"
      : type === "12"
      ? "tour"
      : type === "14"
      ? "culture"
      : "travel";

  const [contentType, setContentType] = useState<string>("");
  const [page, setPage] = useState<[number, number]>([1, 1]);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const tcts = useSelector((state: RootState) => state.tcts);

  useEffect(() => {
    let ref = target.current!;

    const options = {
      root: null, // 타켓 요소가 "어디에" 들어왔을때 콜백함수를 실행할 것인지 결정합니다. null이면 viewport가 root로 지정됩니다.
      //root: document.querySelector('#scrollArea'), => 특정 요소를 선택할 수도 있습니다.
      rootMargin: "0px", // root에 마진값을 주어 범위를 확장 가능합니다.
      threshold: 1.0, // 타겟 요소가 얼마나 들어왔을때 콜백함수를 실행할 것인지 결정합니다. 1이면 타겟 요소 전체가 들어와야 합니다.
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (tcts.loading) return;
      console.log(page);
      console.log(entries)
      let target = entries[0];

      // 검색 결과물에서 모든 데이터를 불러온 경우 tcts.saerchRecord[2] === 'complete'
      // 이때, 다른 검색을 한 경우에 다시 페이지를 불러와야 하므로 아래와 같이 비교식을 작성
      if (
        title === "result" &&
        type === tcts.serchRecord[0] &&
        keyword === tcts.serchRecord[1] &&
        tcts.serchRecord[2] === "complete"
      ) {
        console.log("결과 complted");
        return;
      }

      if (!target.isIntersecting && isIntersecting) {
        console.log("감지 x");
        setIsIntersecting(false);
      }

      if (target.isIntersecting && !isIntersecting) {
        console.log("감지");
        console.log(window.scrollY)
        setIsIntersecting(true);
        setPage([page[0] + 1, page[0]]);
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
    if (tcts.loading) return;
    // 만약 사용자가 url의 region의 값을 '120'과 같이 수정하면 return;
    if (!areaCodeArr.includes(areaCode)) return;

    if (contentType !== type) {
      setPage([1, 1]);
      setContentType(type);
      return;
    }

    const parameter = {
      areaCode,
      type,
      title,
      page,
      keyword,
    };

    const data = tcts[key][areaCode];

    if (data && !isIntersecting) return;

    if (!data) {
      dispatch(getTCTRData(parameter));
      console.log("hi");
    } else if (page[0] > page[1]) {
      console.log("hello");
      setPage([page[0], page[0]]);
      dispatch(getTCTRData(parameter));
    }
    //data.length < page[0] * 50
  }, [
    dispatch,
    tcts,
    page,
    contentType,
    type,
    title,
    areaCode,
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

    const cat1 = params.get("cat1") || "all";
    const cat2 = params.get("cat2") || "all";
    const cat3 = params.get("cat3") || "all";

    let array: Item[] = [];

    if (title === "trend") array = datas[type];
    else array = tcts[key][areaCode];
    console.log(`return result ${array.length}`);
    let result: JSX.Element[] = [];
    let index = 0;
    for (let item of array) {
      if (index > 49) break;
      if (!item.areacode) continue;

      if (cat1 !== "all" && cat1 !== item.cat1) continue;

      if (cat2 !== "all" && cat2 !== item.cat2) continue;

      if (cat3 !== "all" && cat3 !== item.cat3) continue;

      if (!item.firstimage) continue;

      const 지역 = 지역코드[item.areacode] || "";
      const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode] || "";
      const 지역표시 =
        `${지역 && `[${지역}]`}` + " " + `${시군구 && `[${시군구}]`}`;

      const element = (
        <div
          className="card-item"
          key={item.title + `${Math.random()}`}
          onClick={() => cardClickHandler(item.contenttypeid, item.contentid)}
        >
          <div className="tour-image-box">
            <img
              className="card-image"
              src={item.firstimage.replace("http", "https")}
              alt={item.title}
              loading={"lazy"}
            ></img>
          </div>
          <div className="card-text">
            <p className="area">{지역표시}</p>
            <h4>{item.title}</h4>
            <p className="card-tag">{`#${tagName[item.cat3]}`}</p>
          </div>
        </div>
      );
      result.push(element);
      index += 1;
    }
    return result.length === 0 ? (
      <div className="not-found-category">
        <p>조건에 부합하는 결과가 없습니다!</p>
      </div>
    ) : (
      result
    );
  };

  return (
    <>
      {/* <h3 className="result-title">{`' ${keywo rd} ' 검색 결과: ${tcts.result['0'].length}개`}</h3> */}
      {tcts[key][areaCode] && returnResult()}
      {tcts.loading && <Loading />}
      {!tcts.loading && !tcts.successGetData && <GetDataError />}
      {title === "trend" && returnResult()}
    </>
  );
};

export default AnotherCard;
