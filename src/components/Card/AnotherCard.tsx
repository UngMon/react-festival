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

  useEffect(() => {
    // 데이터를 받아오는 과정에서 불 필요한 렌더링 없애기 위함
    if (tcts.loading) return;
    // 만약 사용자가 url의 region 매개변수의 값을 '120'과 같이 수정하면 return;
    if (!areaCdoeArr.includes(params.get("region")!)) return;

    const parameter = {
      areaCode: params.get("region")!,
      cat1: params.get("cat1")!,
      cat2: params.get("cat2")!,
      cat3: params.get("cat3")!,
      type: title === "tour" ? "12" : title === "culture" ? "14" : "25",
    };
    if (title === "tour" && !tcts.touristArray![parameter.areaCode]) {
      dispatch(getTCTRData(parameter));
    }

    if (title === "culture" && !tcts.cultureArray![parameter.areaCode]) {
      dispatch(getTCTRData(parameter));
    }

    if (title === "travel" && !tcts.travelArray![parameter.areaCode]) {
      dispatch(getTCTRData(parameter));
    }
  }, [dispatch, tcts, title, params]);

  const cardClickHandler = (contentId: string) => {
    const type = title === "tour" ? "12" : title === "culture" ? "14" : "25";
    dispatch(firebaseActions.cardClicked());
    naviagate(`/content/search?type=${type}&contentId=${contentId}`);
  };

  const returnResult = () => {
    let array: Item[] = [];

    if (title === "tour") array = tcts.touristArray![category.region];

    if (title === "culture") array = tcts.cultureArray![category.region];

    if (title === "travel") array = tcts.travelArray![category.region];

    let result: JSX.Element[] = [];

    for (let item of array) {
      if (category.cat1 !== "all" && category.cat1 !== item.cat1) continue;

      if (category.cat2 !== "all" && category.cat2 !== item.cat2) continue;

      if (category.cat3 !== "all" && category.cat3 !== item.cat3) continue;

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
        tcts.touristArray![category.region] &&
        returnResult()}
      {title === "culture" && tcts.loading && <Loading />}
      {title === "culture" &&
        tcts.cultureArray![category.region] &&
        returnResult()}
      {title === "travel" && tcts.loading && <Loading />}
      {title === "travel" &&
        tcts.travelArray![category.region] &&
        returnResult()}
    </>
  );
};

export default AnotherCard;
