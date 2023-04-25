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
  const topBarClickHandler = (type: string) => {
    if (type === "리뷰") {
      reviewRef.current!.scrollIntoView({ behavior: "smooth" });
    } else {
      setCategory(type);
      menuBarRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ul className="Cotent-category">
      <li className={category === "기본정보" ? "on" : ""}>
        <button onClick={() => topBarClickHandler("기본정보")}>기본정보</button>
      </li>
      <li className={category === "리뷰" ? "on" : ""}>
        <button onClick={() => topBarClickHandler("리뷰")}>리뷰</button>
      </li>
      <li className={category === "지도" ? "on" : ""}>
        <button onClick={() => topBarClickHandler("지도")}>지도</button>
      </li>
    </ul>
  );
};

export default MenuBar;
