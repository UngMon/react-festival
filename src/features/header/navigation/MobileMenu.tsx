import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "./constants";
import styles from "./MobileMenu.module.css";

interface Props {
  headRef: React.RefObject<HTMLHeadElement>;
}

const MobileMenu = ({ headRef }: Props) => {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const logoutHandler = async () => {
    try {
      await logout();
      setOpenNav(false);
    } catch (error: any) {
      alert("로그아웃 오류 발생");
    } finally {
      navigate("/");
    }
  };

  const setAccountHandler = () => {
    navigate("/user");
    setOpenNav(false);
  };

  const buttonClickHandler = () => {
    setOpenNav(!openNav);

    const magnifying = headRef.current?.querySelector(".magnifying");
    if (!magnifying) return;

    if (magnifying.classList.contains("mag-on"))
      magnifying.classList.remove("mag-on");
    else magnifying.classList.add("mag-on");
  };

  useEffect(() => {
    if (!openNav) return;

    const resizeHandler = () => {
      if (window.innerWidth >= 1024) {
        setOpenNav(false);
        const magnifying = headRef.current?.querySelector(".magnifying");
        if (magnifying) magnifying.classList.remove("mag-on");
      }
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenNav(false);
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [openNav, headRef]);

  return (
    <>
      <button
        className={`${styles[`menu-bar`]} ${openNav ? styles.menuOn : ""}`}
        onClick={buttonClickHandler}
        aria-label="메뉴 열기"
        aria-expanded={openNav}
      >
        <div className={`${styles.bar} ${openNav ? `${styles.roT45}` : ""}`} />
        <div
          className={`${styles.bar} ${openNav ? `${styles.fadeout}` : ""}`}
        />
        <div className={`${styles.bar} ${openNav ? `${styles.roTm45}` : ""}`} />
      </button>
      {/* 2. 오버레이 */}
      <div
        className={styles["menu-overlay"]}
        style={{ right: openNav ? "0" : "-150%" }}
      />
      {/* 3. 사이드바: 핵심 네비게이션 */}
      <aside
        className={styles["menu-drawer"]}
        style={{
          right: openNav ? "0" : "-150%",
        }}
        aria-hidden={!openNav}
      >
        {user?.uid ? (
          <section className={styles["profile-section"]}>
            <figure className={styles["profile-image-placeholder"]}>
              <img
                src={user?.photoURL || "./images/NoImage.png"}
                alt="User"
              ></img>
            </figure>
            <div className={styles["profile-actions"]}>
              <button
                type="button"
                className={styles["account-mgmt-btn"]}
                onClick={setAccountHandler}
              >
                <span className="material-symbols-outlined">
                  settings_account_box
                </span>
                &nbsp;<span>계정관리</span>
              </button>
              <button
                type="button"
                className={styles["logout-btn"]}
                onClick={logoutHandler}
              >
                <span className={`material-symbols-outlined ${styles["icon"]}`}>
                  logout
                </span>
                &nbsp; <span>로그아웃</span>
              </button>
            </div>
          </section>
        ) : (
          <section className={styles["profile-section"]}>
            <Link to="/login" className={styles["login-btn"]}>
              <span className={`material-symbols-outlined ${styles["icon"]}`}>
                login
              </span>
              &nbsp;
              <span>로그인</span>
            </Link>
          </section>
        )}
        <hr className={styles["menu-divider"]}></hr>
        <nav className={styles["menu-nav"]}>
          <h2 className={styles["blind"]}>메뉴 목록</h2>
          {/* 스크린 리더용 제목 */}
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.text}>
                <Link to={item.to} onClick={() => setOpenNav(false)}>
                  <span
                    className={`material-symbols-outlined ${styles["menu-icon"]}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className={styles["menu-text"]}>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
export default MobileMenu;
