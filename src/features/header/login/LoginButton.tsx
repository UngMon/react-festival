import { useAuth } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserActions from "./modal/UserActions";
import userIcon from "assets/login/userIcon.png";
import "./LoginButton.css";

interface T {
  user_page?: boolean;
}

const LoginButton = ({ user_page }: T) => {
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
    <div
      className={`header__login ${user_page ? "header__user-page" : ""}`}
      ref={contianerRef}
    >
      {status === "pending" && <div className="header__not-login" />}
      {status === "fulfilled" && !user?.uid && (
        <button className="header__login-btn" onClick={loginHandler}>
          <span className="material-symbols-outlined">login</span>
        </button>
      )}
      {status === "fulfilled" && user?.uid && (
        <div
          className="header__photo-box"
          onClick={() => setUserModalOpen(!userModalOpen)}
        >
          <img src={user?.photoURL || userIcon} alt=""></img>
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
