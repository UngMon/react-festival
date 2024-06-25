import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./LoginButton.css";
import { firebaseActions } from "../../redux/firebase-slice";

const LoginButton = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [userChecking, setUserChecking] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const userImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserData(user);
        dispatch(
          firebaseActions.login({
            userUid: user.uid,
            userName: user.displayName || "",
            userEmail: user.email || "",
            userPhoto: user.photoURL || "",
          })
        );
      } else dispatch(firebaseActions.nonExistUserData());
    });
    setUserChecking(false);
  }, [dispatch]);

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
        setUserData(null);
        dispatch(firebaseActions.logout());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      {userChecking && <div className="not-Login" />}
      {!userChecking && (
        <div>
          {!userData && (
            <div className="login" onClick={loginHandler}>
              <FontAwesomeIcon icon={faRightToBracket} />
            </div>
          )}
          {userData && (
            <div
              className="userPhoto-box"
              ref={userImageRef}
              onClick={() => setUserModalOpen(!userModalOpen)}
            >
              <img src={userData!.photoURL!} alt="userPhoto"></img>
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
        </div>
      )}
    </>
  );
};

export default LoginButton;
