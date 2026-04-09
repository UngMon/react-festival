import { useEffect, useRef } from "react";
import { CATEGORY } from "../constant/constant";
import { useAuth } from "context/AuthContext";
import styles from "./SubMenu.module.css";

interface Props {
  setCategory: (value: string) => void;
  category: string;
}

const SubMenu = ({ setCategory, category }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const userName = useAuth().user?.displayName;

  const handleClick = (type: string) => {
    setCategory(type);
  };

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const mql = window.matchMedia("(max-width:1023px)");

    const handleResize = () => {
      // 리사이즈 중에는 클래스 추가
      const divElement = divRef.current;
      const navElement = navRef.current;
      if (!divElement || !navElement) return;

      divElement.classList.add(`${styles["resize-animation-stopper"]}`);
      navElement.classList.add(`${styles["resize-animation-stopper"]}`);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // 리사이즈가 끝나면 클래스 제거
        divElement.classList.remove(`${styles["resize-animation-stopper"]}`);
        navElement.classList.remove(`${styles["resize-animation-stopper"]}`);
      }, 400); // 400ms 정도의 여유
    };

    mql.addEventListener("change", handleResize);
    return () => mql.removeEventListener("change", handleResize);
  }, []);

  return (
    <aside className={styles["submenu"]}>
      {/* <div className={`${styles["menu-overlay"]} ${styles["on"]}`} ref={divRef}> */}
      <nav
        className={styles["submenu-wrapper"]}
        onClick={(e) => e.stopPropagation()}
        ref={navRef}
      >
        <div className={styles["submenu__title"]}>
          <span>{`안녕하세요! ${userName ? `${userName}님` : ""}`}</span>
          <br />
          <span>'이곳저곳' 발자취를 한곳에서 관리해 보세요.</span>
        </div>
        <ul className={styles["submenu__list"]}>
          {CATEGORY.map((item) => (
            <li
              key={item[0]}
              className={category === item[0] ? styles["check"] : ""}
            >
              <button
                className={category === item[0] ? styles["sub-check"] : ""}
                onClick={() => handleClick(item[0])}
              >
                <span className="material-symbols-outlined">{item[1]}</span>
                <span>{item[2]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SubMenu;
