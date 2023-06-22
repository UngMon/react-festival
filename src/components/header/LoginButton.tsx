import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { firebaseActions } from "../../redux/firebase-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./LoginButton.css";

interface HeaderProps {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  setOpenSearch: (value: boolean) => void;
}

const LoginButton = ({
  pathname,
  scrollY,
  mouseOver,
  setOpenSearch,
}: HeaderProps) => {
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
        console.log("userImageRef");
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
    sessionStorage.setItem("currentUrl", JSON.stringify(location.pathname));
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
          <div className="login" onClick={loginHandler}>
            <FontAwesomeIcon icon={faRightToBracket} />
          </div>
        ) : (
          // 로그인 상태일 때
          <>
            <div
              className="userPhoto-box"
              ref={userImageRef}
              onClick={() => setUserModalOpen(!userModalOpen)}
            >
              <img src={firebaseState.userPhoto} alt="userPhoto"></img>
            </div>
            {userModalOpen && (
              <div className="logout-box" ref={userInfoRef}>
                <div className="arrow"></div>
                <div className="logout" onClick={logoutHnalder}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  <span>로그아웃</span>
                </div>
              </div>
            )}
          </>
        )
      ) : (
        // 새로고침시 잠깐동안 다른 ui보여줌
        <div className="not-Login"></div>
      )}
    </>
  );
};

export default LoginButton;


            //${pathname === "/" && scrollY === 0 && !mouseOver
            // ? "scroll-top-color"
            // : "#normal-color"}//