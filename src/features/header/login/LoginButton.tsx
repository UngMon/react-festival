import { useAuth } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserActions from "./modal/UserActions";
import styles from "./LoginButton.module.css";
import userIcon from "assets/login/userIcon.png";

const LoginButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, status, logout } = useAuth();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const contianerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1024px 미만일 때 처리하는 매치미디어
    const mql = window.matchMedia("(max-width: 1023px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setUserModalOpen(false); // 화면이 작아지면 모달 닫기
    };

    mql.addEventListener("change", handleResize);

    return () => mql.removeEventListener("change", handleResize);
  }, []);

  const loginHandler = () => {
    sessionStorage.setItem(
      "previouseUrl",
      JSON.stringify(location.pathname + location.search),
    );
    navigate("/login");
  };

  return (
    <div className={styles["login-button-container"]} ref={contianerRef}>
      {status === "pending" && <div className={styles["not-Login"]} />}
      {status === "fulfilled" && !user?.uid && (
        <button className={styles["login-button"]} onClick={loginHandler}>
          <span className="material-symbols-outlined">login</span>
        </button>
      )}
      {status === "fulfilled" && user?.uid && (
        <div
          className={styles["userphoto-box"]}
          onClick={() => setUserModalOpen(!userModalOpen)}
        >
          <img src={user?.photoURL || userIcon} alt="userphoto"></img>
        </div>
      )}
      {userModalOpen && (
        <UserActions
          user_name={user?.displayName}
          user_photo={user?.photoURL}
          setUserModalOpen={setUserModalOpen}
          containerRef={contianerRef}
          logout={logout}
        />
      )}
    </div>
  );
};

export default LoginButton;
