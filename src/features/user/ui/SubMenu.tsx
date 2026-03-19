import { useEffect, useRef, useState } from "react";
import { CATEGORY_TITLES } from "../constant/constant";
import styles from "./SubMenu.module.css";

interface Props {
  setCategory: (value: string) => void;
  category: string;
}

const SubMenu = ({ setCategory, category }: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (type: string) => {
    setCategory(type);
    setOpen(false);
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
    <section className={styles['submenu-section']}>
      <button
        className={styles["nav-button"]}
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="material-symbols-outlined">format_list_bulleted</span>
      </button>
      <div
        className={`${styles["menu-overlay"]} ${open && styles["on"]}`}
        ref={divRef}
        onClick={() => setOpen(false)}
      >
        <nav
          className={`${styles["menu"]} ${open && styles["on"]}`}
          onClick={(e) => e.stopPropagation()}
          ref={navRef}
        >
          <div className={styles["picked-category"]}>
            <span className="material-symbols-outlined">book_ribbon</span>
            <span>{CATEGORY_TITLES[category]}</span>
          </div>
          <ul>
            <li>
              <button onClick={() => handleClick("userInfo")}>
                <span className="material-symbols-outlined">
                  settings_account_box
                </span>
                <span>계정 관리</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleClick("myComment")}>
                <span className="material-symbols-outlined">rate_review</span>
                <span>댓글 기록</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleClick("likedContent")}>
                <span className="material-symbols-outlined">favorite</span>
                <span>좋아요 누른 콘텐츠</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleClick("likedComment")}>
                <span className="material-symbols-outlined">thumb_up</span>
                <span>좋아요 누른 댓글</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default SubMenu;
