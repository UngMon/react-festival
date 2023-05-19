import { useSelector } from "react-redux";
import { Item } from "../../type/Common";
import { RootState } from "../../redux/store";
import Loading from "../ui/loading/Loading";

interface Props {
  title: string;
}

const AnotherCard = ({title}: Props) => {
  const tourState = useSelector((state: RootState) => state.tour);
  const cultureState = useSelector((state: RootState) => state.culture);

  let array: Item[] = [];
  if (title === 'tour') array = tourState.touristArray![tourState.region];

  if (title === 'culture') array = cultureState.cultureArray![cultureState.region];
  console.log(array)
  console.log(cultureState.cultureArray![cultureState.region])
  const returnResult = () => {
    console.log('여기')
    return array.map((item) => (
      <div
        className="card-item"
        key={item.title}
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
    ));
  };

  return (
    <>
      {title === 'tour' && tourState.loading && <Loading />}
      {title === 'tour' && tourState.successGetData && returnResult()}
      {title === 'culture' && cultureState.loading && <Loading />}
      {title === 'culture' && cultureState.successGetData && returnResult()}
    </>
  );
};

export default AnotherCard;
