import { Item } from "../../type/Common";
import AnotherCard from "./AnotherCard";
import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  searchArray?: Item[];
}

const Card = (props: CardProps) => {
  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">
        {props.title !== "festival" && <AnotherCard title={props.title}/>}
        {props.title === "festival" && <FestivalCard />}
      </div>
    </article>
  );
};

export default Card;
