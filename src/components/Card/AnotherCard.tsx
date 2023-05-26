import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Item } from "../../type/Common";
import { RootState, useAppDispatch } from "../../redux/store";
import { getTCTRData } from "../../redux/fetch-action";
import { useNavigate, useSearchParams } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import Loading from "../ui/loading/Loading";
import GetDataError from "../error/GetDataError";

interface Props {
  title: string;
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

const AnotherCard = ({ title }: Props) => {
  const dispatch = useAppDispatch();
  const naviagate = useNavigate();

  const tcts = useSelector((state: RootState) => state.tcts);
  const category = useSelector((state: RootState) => state.category);

  const [params] = useSearchParams();
  const areaCode = params.get("areaCode")!;
  const cat1 = params.get("cat1")!;
  const cat2 = params.get("cat2")!;
  const cat3 = params.get("cat3")!;

  useEffect(() => {
    // 데이터를 받아오는 과정에서 불 필요한 렌더링 없애기 위함
    if (tcts.loading) return;
    // 만약 사용자가 url의 region 매개변수의 값을 '120'과 같이 수정하면 return;
    if (!areaCdoeArr.includes(areaCode)) return;

    const parameter = {
      areaCode,
      type: title === "tour" ? "12" : title === "culture" ? "14" : "25",
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
  }, [dispatch, tcts, title, areaCode, cat1, cat2, cat3]);

  const cardClickHandler = (contentId: string) => {
    const type = title === "tour" ? "12" : title === "culture" ? "14" : "25";
    dispatch(firebaseActions.cardClicked());
    naviagate(`/content/search?type=${type}&contentId=${contentId}`);
  };

  const returnResult = () => {
    console.log(title, areaCode, cat1, cat2, cat3)

    let array: Item[] = [];

    if (title === "tour") array = tcts.touristArray![areaCode];

    if (title === "culture") array = tcts.cultureArray![areaCode];

    if (title === "travel") array = tcts.travelArray![areaCode];

    let result: JSX.Element[] = [];
    console.log(array)
    for (let item of array) {
      if (cat1 !== "all" && cat1 !== item.cat1) continue;

      if (cat2 !== "all" && cat2 !== item.cat2) continue;

      if (cat3 !== "all" && cat3 !== item.cat3) continue;

      const element = (
        <div
          className="card-item"
          key={item.title + `${Math.random()}`}
          onClick={() => cardClickHandler(item.contentid)}
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
            <h3>{item.title}</h3>
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
      {title === "tour" &&
        tcts.touristArray![areaCode] &&
        returnResult()}
      {title === "culture" && tcts.loading && <Loading />}
      {title === "culture" &&
        tcts.cultureArray![areaCode] &&
        returnResult()}
      {title === "travel" && tcts.loading && <Loading />}
      {title === "travel" &&
        tcts.travelArray![areaCode] &&
        returnResult()}
    </>
  );
};

export default AnotherCard;
