import { useState } from "react";
import "./MenuBar.css";

interface MenuBarProps {
  category: string;
  setCategory: (text: string) => void;
  menuBarRef: React.RefObject<HTMLHeadingElement>;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const MenuBar = ({
  category,
  setCategory,
  menuBarRef,
  reviewRef,
}: MenuBarProps) => {
  const [reviewActive, setReviewActive] = useState<boolean>(false);

  const topBarClickHandler = (type: string) => {
    if (type === "리뷰") {
      setReviewActive(true);
      reviewRef.current!.scrollIntoView({ behavior: "smooth" });
    } else {
      setCategory(type);
      setReviewActive(false);
      menuBarRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ul className="Cotent-category">
      <li>
        <button
          className={category === "기본정보" && !reviewActive ? "on" : "off"}
          onClick={() => topBarClickHandler("기본정보")}
        >
          기본정보
        </button>
      </li>
      <li>
        <button
          className={reviewActive ? "on" : "off"}
          onClick={() => topBarClickHandler("리뷰")}
        >
          리뷰
        </button>
      </li>
      <li>
        <button
          className={category === "지도" && !reviewActive ? "on" : "off"}
          onClick={() => topBarClickHandler("지도")}
        >
          지도
        </button>
      </li>
    </ul>
  );
};

export default MenuBar;
