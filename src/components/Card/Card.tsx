import { Item } from "../../type/Common";
import { useRef } from "react";
import AnotherCard from "./AnotherCard";
import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  searchArray?: Item[];
}

const Card = (props: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <article className="main-box-content" ref={cardRef}>
      <div className="AllView-grid-box">
        {props.title !== "festival" && <AnotherCard title={props.title} />}
        {props.title === "festival" && <FestivalCard />}
      </div>
    </article>
  );
};

export default Card;
