import { useEffect, useState } from "react";
import "./MenuBar.css";

interface MenuBarProps {
  infoRef: React.RefObject<HTMLHeadingElement>;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const MenuBar = ({
  infoRef,
  reviewRef,
}: MenuBarProps) => {
  const [category, setCategory] = useState<string>("기본정보")
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const topBarClickHandler = (type: string) => {
    if (type === "사진") {
      window.scrollTo({ behavior: "smooth", top: 0 });
    }

    if (type === "기본정보" && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (type === "리뷰" && reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setCategory(type);
  };

  useEffect(() => {
    const scrollPosition = () => {
      if (window.scrollY > 510) setIsFixed(true);
      else setIsFixed(false);
    };

    window.addEventListener("scroll", scrollPosition);
    return () => {
      window.removeEventListener("scroll", scrollPosition);
    };
  });

  return (
    <div className="Content-menu-box">
      <nav className={`Content-menu-nav ${isFixed ? "fixed-tab" : ""}`}>
        <ul className="Cotent-menu">
          <li>
            <button
              className={category === "사진" ? "on" : "off"}
              onClick={() => topBarClickHandler("사진")}
            >
              사진
            </button>
          </li>
          <li>
            <button
              className={category === "기본정보" ? "on" : "off"}
              onClick={() => topBarClickHandler("기본정보")}
            >
              기본정보
            </button>
          </li>
          <li>
            <button
              className={category === "리뷰" ? "on" : "off"}
              onClick={() => topBarClickHandler("리뷰")}
            >
              리뷰
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;
