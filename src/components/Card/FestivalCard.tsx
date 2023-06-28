import { useEffect } from "react";
import { Item } from "../../type/Common";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { festivalActions } from "../../redux/festival-slice";
import { getFestiavalData } from "../../redux/fetch-action";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dateSlice } from "../../utils/DateSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { 지역코드, 시군코드 } from "../../type/Common";
import Loading from "../loading/Loading";

interface T {
  isSearch?: boolean;
  target: React.RefObject<HTMLDivElement>;
}

const FestivalCard = ({ isSearch, target }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const festival = useSelector((state: RootState) => state.festival);
  const tcts = useSelector((state: RootState) => state.tcts);

  const [params] = useSearchParams();

  const pickMonth = params.get("month");
  const areaCode = params.get("areaCode");
  const cat2 = params.get("cat2");
  const cat3 = params.get("cat3");

  const cardClickHandler = (contentId: string) => {
    dispatch(firebaseActions.cardClicked());
    navigate(`/content/search?type=15&contentId=${contentId}`);
  };

  useEffect(() => {
    if (!festival.successGetData) dispatch(getFestiavalData());

    if (festival.successGetData && !festival.sortedFestivalArr) {
      dispatch(festivalActions.sortFestivalArray());
    }
  }, [dispatch, festival]);

  let array: Item[] = [];
  let 행사종료: JSX.Element[] = [];
  let 행사중: JSX.Element[] = [];
  let 행사시작전: JSX.Element[] = [];

  const makeFestivlaCard = () => {
    const { year, month, date } = nowDate();
    // console.log(areaCode, month, cat2, cat3);
    if (areaCode === "0") {
      //O(1)
      array = festival.monthArray[pickMonth!];
    } else {
      //O(n)
      array = festival.monthArray[pickMonth!].filter(
        (item) => item.areacode === areaCode
      );
    }

    // if (isSearch) array = tcts.result!;

    for (let item of array) {

      if (cat2 !== "all" && item.cat2 !== cat2) continue;

      if (cat3 !== "all") {
        if (item.cat3 !== cat3) continue;
      }

      const 행사상태 = calculateDate(
        item.eventstartdate!,
        item.eventenddate!,
        year,
        month,
        date
      );

      if (행사상태 === "진행중") {
        if (!festival.행사상태[0]) continue;
      } else if (행사상태 === "행사종료") {
        if (!festival.행사상태[2]) continue;
      } else {
        if (!festival.행사상태[1]) continue;
      }

      let firstImage = item.firstimage;
      let imageUri = "";

      if (firstImage) {
        // 관광공사에서 제공하는 이미지 url이 하필 http....
        firstImage = firstImage.replace("http", "https");
      }

      // if (param.contentData[item.contentid]) {
      //   // firebase storage에 저장된 이미지를 사용할 경우..
      //   // 그런데 이 방법은 좋기는 하나 이미지 저작권 문제를 피할 수 없음...
      //   imageUri = param.contentData[item.contentid].firstImage;
      // }

      const 지역 = 지역코드[item.areacode] || "";
      const 시군구 = 시군코드[지역코드[item.areacode]][item.sigungucode] || "";
      const 지역표시 =
        `${지역 && `[${지역}]`}` + " " + `${시군구 && `[${시군구}]`}`;

      const element = (
        <div
          className="card-item"
          key={item.title}
          onClick={() => cardClickHandler(item.contentid)}
        >
          <div className="festival-image-box">
            <img
              className="card-image"
              src={firstImage || imageUri || "/images/NoImage.png"}
              alt={item.title}
              loading={"lazy"}
            ></img>
          </div>
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
          <div className="card-text">
            <p className="area">{지역표시}</p>
            <h4 className="prevent-overflow">{item.title}</h4>
            <p className="card-date">
              {dateSlice(item.eventstartdate!, item.eventenddate!)}
            </p>
          </div>
        </div>
      );

      if (행사상태 === "행사종료") {
        행사종료.push(element);
        continue;
      } else if (행사상태 === "진행중") {
        행사중.push(element);
        continue;
      } else {
        행사시작전.push(element);
      }
    }

    return 행사중.length === 0 &&
      행사시작전.length === 0 &&
      행사종료.length === 0 ? (
      <div className="not-found-data">
        <p>조건에 맞는 정보가 없습니다.</p>
      </div>
    ) : (
      [...행사중, ...행사시작전, ...행사종료]
    );
  };

  return (
    <>
      {!festival.sortedFestivalArr && <Loading />}
      {festival.sortedFestivalArr && makeFestivlaCard()}
    </>
  );
};

export default FestivalCard;
