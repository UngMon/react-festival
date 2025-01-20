import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { firebaseActions } from "../../redux/firebase-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./LoginButton.css";

const LoginButton = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userData = useSelector((state: RootState) => state.firebase);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const userImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData.loadingState === "fulfilled") return;
    onAuthStateChanged(getAuth(), (userInfo) => {
      if (userInfo) {
        const { uid, displayName, email, photoURL } = userInfo!;
        dispatch(
          firebaseActions.login({ user: { uid, displayName, email, photoURL } })
        );
      } else {
        dispatch(firebaseActions.userNotFound());
      }
    });
  }, [userData, dispatch]);

  useEffect(() => {
    if (!userModalOpen) return;

    const logoutModalOpen = (event: MouseEvent) => {
      if (userImageRef.current?.contains(event.target as Node)) return;
      setUserModalOpen(false);
    };

    window.addEventListener("click", logoutModalOpen);
    return () => window.removeEventListener("click", logoutModalOpen);
  });

  const loginHandler = () => {
    sessionStorage.setItem(
      "previouseUrl",
      JSON.stringify(location.pathname + location.search)
    );
    navigate("/login");
  };

  const logoutHnalder = () => {
    signOut(getAuth())
      .then(() => {
        sessionStorage.clear();
        dispatch(firebaseActions.logout());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      {userData.loadingState === "pending" && <div className="not-Login" />}
      {userData.loadingState === "fulfilled" && (
        <>
          {userData.loginedUser === false ? (
            <div className="login" onClick={loginHandler}>
              <FontAwesomeIcon icon={faRightToBracket} />
            </div>
          ) : (
            <div
              className="userPhoto-box"
              ref={userImageRef}
              onClick={() => setUserModalOpen(!userModalOpen)}
            >
              <img src={userData.user_photo} alt="userPhoto"></img>
              {userModalOpen && (
                <div className="logout-box">
                  <div className="arrow"></div>
                  <div className="logout" onClick={logoutHnalder}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <span>로그아웃</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LoginButton;
