import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firebaseActions } from "store/firebase-slice";
import { RootState, useAppDispatch } from "store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./LoginButton.module.css";
import UserActions from "./modal/UserActions";

const LoginButton = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { status, current_user_id, current_user_photo, current_user_name } =
    useSelector((state: RootState) => state.firebase);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const contianerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "fulfilled") return;
    onAuthStateChanged(getAuth(), (userInfo) => {
      if (userInfo) {
        const { uid, displayName, email, photoURL } = userInfo!;
        dispatch(
          firebaseActions.login({
            user: { uid, displayName, email, photoURL },
          }),
        );
      } else {
        dispatch(firebaseActions.userNotFound());
      }
    });
  }, [status, dispatch]);

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
      {status === "fulfilled" && current_user_id === "" && (
        <button className={styles["login-button"]} onClick={loginHandler}>
          <span className="material-symbols-outlined">login</span>
        </button>
      )}
      {status === "fulfilled" && current_user_id !== "" && (
        <div
          className={styles["userphoto-box"]}
          onClick={() => setUserModalOpen(!userModalOpen)}
        >
          <img src={current_user_photo} alt="userphoto"></img>
        </div>
      )}
      {userModalOpen && (
        <UserActions
          current_user_name={current_user_name}
          current_user_photo={current_user_photo}
          setUserModalOpen={setUserModalOpen}
          containerRef={contianerRef}
        />
      )}
    </div>
  );
};

export default LoginButton;
