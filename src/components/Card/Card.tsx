import { useRef } from "react";
import AnotherCard from "./AnotherCard";
import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  isSearch?: boolean; // 검색용 카드인지
}

const Card = (props: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <article className="main-box-content" ref={cardRef}>
      <div className="AllView-grid-box">
        {props.title !== "festival" && (
          <AnotherCard title={props.title} isSearch={props.isSearch} />
        )}
        {props.title === "festival" && (
          <FestivalCard isSearch={props.isSearch} />
        )}
      </div>
    </article>
  );
};

export default Card;
