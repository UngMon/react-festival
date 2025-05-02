import { useCallback, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { firebaseActions } from "../../redux/firebase-slice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./MobileMenu.css";

interface T {
  headRef: React.RefObject<HTMLHeadElement>;
}

const MobileMenu = ({ headRef }: T) => {
  const dispatch = useAppDispatch();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const userData = useSelector((state: RootState) => state.firebase);
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  console.log(userData);
  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        setOpenNav(false);
        dispatch(firebaseActions.logout());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const buttonClickHandler = useCallback(() => {
    setOpenNav(!openNav);
    setScrollY(window.scrollY);

    const magnifying = headRef.current?.querySelector(".magnifying");
    if (!magnifying) return;

    if (magnifying.classList.contains("mag-on")) {
      magnifying.classList.remove("mag-on");
    } else magnifying.classList.add("mag-on");
  }, [headRef, openNav]);

  useEffect(() => {
    if (!openNav) return;

    function preventDefault(e: Event) {
      e.preventDefault();
      // if (window.scrollY > 0)
      window.scrollTo(0, scrollY);
    }

    const resizeHandler = () => {
      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") buttonClickHandler();
    };

    const options = { passive: false };

    window.addEventListener("wheel", preventDefault, options);
    window.addEventListener("touchmove", preventDefault, options); // 모바일 터치 스크롤도 막기
    window.addEventListener("scroll", preventDefault, options);
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("scroll", preventDefault);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [openNav, scrollY, buttonClickHandler]);

  const convertUserEmail = () => {
    let provider = auth.currentUser?.uid;
    let email = auth.currentUser!.email!;

    if (provider?.includes("kakao:") || provider?.includes("naver:")) {
      email = email.split(/\bkakao_|naver_/)[1];
    }

    return email;
  };

  return (
    <nav className="side-container">
      <button
        className={`${openNav ? "nav-bar acti" : "nav-bar"}`}
        onClick={buttonClickHandler}
      >
        <div className={`bar ${openNav ? "ro-t45" : ""}`} />
        <div className={`bar ${openNav ? "fadeout" : ""}`} />
        <div className={`bar ${openNav ? "ro-b45" : ""}`} />
      </button>
      <div
        className="side-background"
        style={{
          right: openNav ? "0" : "-150%",
        }}
      />
      <ul
        style={{
          right: openNav ? "0" : "-150%",
        }}
      >
        {userData.user_id ? (
          <div className="user-info-box">
            <div>
              <img src={userData.user_photo} alt="User"></img>
            </div>
            <p className="mo-email">{convertUserEmail()}</p>
            <button className="mo-logout" onClick={logoutHandler}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              &nbsp; 로그아웃
            </button>
          </div>
        ) : (
          <li>
            <Link
              to="/login"
              className="side-item"
              // onClick={() => setOpenNav(false)}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              &nbsp; 로그인
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/tour?contentTypeId=12&areaCode=1&cat1=all&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            관광지
          </Link>
        </li>
        <li>
          <Link
            to="/culture?contentTypeId=14&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            문화시설
          </Link>
        </li>
        <li>
          <Link
            to={`/festival?contentTypeId=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            축제/공연/행사
          </Link>
        </li>
        <li>
          <Link
            to="/travel?contentTypeId=25&areaCode=1&cat1=C01&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            여행코스
          </Link>
        </li>
        <li>
          <Link
            to="/culture?contentTypeId=28&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            레포츠
          </Link>
        </li>
        <li>
          <Link
            to="/culture?contentTypeId=32&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            숙박
          </Link>
        </li>
        <li>
          <Link
            to="/culture?contentTypeId=38&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            쇼핑
          </Link>
        </li>
        <li>
          <Link
            to="/culture?contentTypeId=39&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            음식점
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default MobileMenu;
