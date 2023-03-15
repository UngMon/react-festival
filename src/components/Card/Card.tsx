import { useNavigate } from "react-router-dom";
import { Item } from "../../modules/Type";
import { dataSlice } from "../../modules/DataSlice";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import "./Card.css";

interface CardProps {
  type: string;
  month?: string;
  areaCode?: string;
  season?: string;
}

const Card = (props: CardProps) => {
  const navigate = useNavigate();
  const festivalState = useSelector((state: RootState) => state.festival);

  const cardClickHandler = (contentid: string) => {
    navigate(`/content/${contentid}`);
  };

  const returnArray = () => {
    let array: Item[] = [];

    if (props.month === "all") {
      if (props.type === "all") array = festivalState.festivalArray;

      if (props.type === "region")
        array = festivalState.regionArray[props.areaCode!];

      if (props.type === "season")
        array = festivalState.seasonArray[props.season!];

      if (props.type === "search" ) {
        if (festivalState.searchArray.length === 0) {
          return <p>찾으시는 정보가 없어요!</p>
        }
        array = festivalState.searchArray;
      }
        
    } else array = festivalState.monthArray[props.month!];

    return array.map((item) => (
      <div
        className="festival-item"
        key={item.title}
        onClick={() => cardClickHandler(item.contentid)}
      >
        <div className="image-box">
          <img
            className="festival-image"
            src={item.firstimage || "./NoImage.png"}
            alt={item.title}
          ></img>
        </div>
        <div className="event-date">
          {dataSlice(item.eventstartdate, item.eventenddate)}
        </div>
        <div className="event-title">{item.title}</div>
      </div>
    ));
  };

  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">
        {returnArray()}
      </div>
    </article>
  );
};

export default Card;
