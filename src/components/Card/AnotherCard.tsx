import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { getTCTRData } from "../../redux/fetch-action";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { Item, 지역코드, 시군코드, tagName } from "../../type/Common";
import Loading from "../loading/Loading";
import GetDataError from "../error/GetDataError";

interface Props {
  title: string;
  isSearch?: boolean;
}

const areaCdoeArr = [
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

const AnotherCard = ({ title, isSearch }: Props) => {
  const dispatch = useAppDispatch();
  const naviagate = useNavigate();

  const tcts = useSelector((state: RootState) => state.tcts);

  const [params] = useSearchParams();
  const areaCode = params.get("areaCode")!;
  const type = params.get("type")!;
  const cat1 = params.get("cat1") || "all";
  const cat2 = params.get("cat2") || "all";
  const cat3 = params.get("cat3") || "all";

  useEffect(() => {
    // 데이터를 받아오는 과정에서 불 필요한 렌더링 없애기 위함
    if (tcts.loading) return;
    // 만약 사용자가 url의 region의 값을 '120'과 같이 수정하면 return;
    if (!areaCdoeArr.includes(areaCode)) return;

    const parameter = {
      areaCode,
      type,
      title,
    };
    
    if (title === "tour" && !tcts.touristArray![areaCode]) {
      dispatch(getTCTRData(parameter));
    }

    if (title === "culture" && !tcts.cultureArray![areaCode]) {
      dispatch(getTCTRData(parameter));
    }

    if (title === "travel" && !tcts.travelArray![areaCode]) {
      dispatch(getTCTRData(parameter));
    }
  }, [dispatch, tcts, type, title, areaCode, cat1, cat2, cat3]);

  const cardClickHandler = (type: string, contentId: string) => {
    dispatch(firebaseActions.cardClicked());
    naviagate(`/content/search?type=${type}&contentId=${contentId}`);
  };

  const returnResult = () => {
    // console.log(title, areaCode, cat1, cat2, cat3);

    let array: Item[] = [];

    if (title === "tour") array = tcts.touristArray![areaCode];

    if (title === "culture") array = tcts.cultureArray![areaCode];

    if (title === "travel") array = tcts.travelArray![areaCode];

    if (title === "result") array = tcts.searchArray!;

    let result: JSX.Element[] = [];

    for (let item of array) {
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
      {title === "tour" &&
        (tcts.loading ? <Loading /> : !tcts.successGetData && <GetDataError />)}
      {title === "tour" && tcts.touristArray![areaCode] && returnResult()}
      {title === "culture" && tcts.loading && <Loading />}
      {title === "culture" && tcts.cultureArray![areaCode] && returnResult()}
      {title === "travel" && tcts.loading && <Loading />}
      {title === "travel" && tcts.travelArray![areaCode] && returnResult()}
      {title === "result" &&
        tcts.serchRecord[0] === "fulfiled" &&
        returnResult()}
    </>
  );
};

export default AnotherCard;
