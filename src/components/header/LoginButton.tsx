import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase/firestore";
import { firebaseActions } from "../../redux/firebase-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import classes from "./LoginButton.module.css";

const LoginButton = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const firebaseState = useSelector((state: RootState) => state.firebase);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const userImageRef = useRef<HTMLDivElement>(null);
  const userInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logoutModalOpen = (event: any) => {
      if (userImageRef.current?.contains(event.target)) {
        return;
      }

      if (userInfoRef.current?.contains(event.target)) {
        return;
      }
      setUserModalOpen(false);
    };
    if (userModalOpen) {
      window.addEventListener("click", logoutModalOpen);
      return () => window.removeEventListener("click", logoutModalOpen);
    }
  }, [userModalOpen]);

  const loginHandler = () => {
    sessionStorage.setItem('currentUrl', JSON.stringify(location.pathname))
    navigate("/login");
  };

  const logoutHnalder = () => {
    signOut(auth)
      .then(() => {
        dispatch(firebaseActions.logOutUser());
        sessionStorage.clear();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      {!firebaseState.userChecking ? ( // onAuthState에서 유저 정보를 확인했고,
        !firebaseState.loginedUser ? ( // 로그인 안 되어 있으면,
          <div className={classes.login} onClick={loginHandler}>
            <img src="/images/user.png" alt="user"></img>
            <p>로그인</p>
          </div>
        ) : (
          // 로그인 상태일 때
          <div className={classes["userPhoto-box"]}>
            <div
              ref={userImageRef}
              onClick={() => setUserModalOpen(!userModalOpen)}
            >
              <img src={firebaseState.userPhoto} alt="userPhoto"></img>
            </div>
            {userModalOpen && (
              <div className={classes["logout-box"]} ref={userInfoRef}>
                <p>{`${firebaseState.userName}님`}</p>
                <p>
                  {firebaseState.userSocial
                    ? firebaseState.userEmail.slice(5)
                    : firebaseState.userEmail}
                </p>
                <button className={classes.logout} onClick={logoutHnalder}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        // 새로고침시 잠깐동안 다른 ui보여줌
        <div className={classes["not-Login"]}></div>
      )}
    </>
  );
};

export default LoginButton;
