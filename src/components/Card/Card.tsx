import { useRef } from "react";
import AnotherCard from "./AnotherCard";
import FestivalCard from "./FestivalCard";
import "./Card.css";

interface CardProps {
  title: string;
  isSearch?: boolean; // 검색용 카드인지
}

const Card = (props: CardProps) => {
  const target = useRef<HTMLDivElement>(null);

  return (
    <article className="main-box-content">
      <div className="AllView-grid-box">
        <AnotherCard title={props.title} target={target} />
        {/* {props.title !== "festival" && (
          <AnotherCard title={props.title} target={target}/>
        )}
        {props.title === "festival" && (
          <FestivalCard target={target}/>
        )} */}
      </div>
      <div ref={target}></div>
    </article>
  );
};

export default Card;
