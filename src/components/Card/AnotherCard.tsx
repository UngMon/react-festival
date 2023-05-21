import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Item } from "../../type/Common";
import { RootState, useAppDispatch } from "../../redux/store";
import { getTCTRData } from "../../redux/fetch-action";
import Loading from "../ui/loading/Loading";

interface Props {
  title: string;
}

const AnotherCard = ({ title }: Props) => {
  const dispatch = useAppDispatch();

  const tour = useSelector((state: RootState) => state.tour);
  const culture = useSelector((state: RootState) => state.culture);
  const category = useSelector((state: RootState) => state.category);

  useEffect(() => {
    const parameter = {
      region: category.region,
      cat1: category.cat1,
      cat2: category.cat2,
      cat3: category.cat3,
      type: title === "tour" ? "12" : title === "culture" ? "14" : "25",
    };
    if (title === "tour" && !tour.touristArray![category.region]) {
      dispatch(getTCTRData(parameter));
    }

    if (title === "culture" && !culture.cultureArray![category.region]) {
      dispatch(getTCTRData(parameter));
    }
  }, [dispatch, category, tour, title, culture]);

  const returnResult = () => {
    let array: Item[] = [];

    if (title === "tour") array = tour.touristArray![category.region];

    if (title === "culture") array = culture.cultureArray![category.region];

    let result: JSX.Element[] = [];

    for (let item of array) {
      if (category.cat1 !== "all" && category.cat1 !== item.cat1) continue;

      if (category.cat2 !== "all" && category.cat2 !== item.cat2) continue;

      if (category.cat3 !== "all" && category.cat3 !== item.cat3) continue;

      const element = (
        <div
          className="card-item"
          key={item.title + `${Math.random()}`}
          // onClick={() => cardClickHandler(item.contentid)}
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
      {title === "tour" && tour.loading && <Loading />}
      {title === "tour" &&
        tour.touristArray![category.region] &&
        returnResult()}
      {title === "culture" && culture.loading && <Loading />}
      {title === "culture" &&
        culture.cultureArray![category.region] &&
        returnResult()}
    </>
  );
};

export default AnotherCard;
