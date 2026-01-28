import { useCallback, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { firebaseActions } from "store/firebase-slice";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openNav, setOpenNav] = useState<boolean>(false);
  // const [scrollY, setScrollY] = useState<number>(0);
  const { current_user_id, current_user_photo } = useSelector(
    (state: RootState) => state.firebase
  );
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

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

  const buttonClickHandler = () => {
    setOpenNav(!openNav);
    // setScrollY(window.scrollY);

    // const magnifying = headRef.current?.querySelector(".magnifying");
    // if (!magnifying) return;

    // if (magnifying.classList.contains("mag-on")) {
    //   magnifying.classList.remove("mag-on");
    // } else magnifying.classList.add("mag-on");
  };

  useEffect(() => {
    if (!openNav) return;

    // function preventDefault(e: Event) {
    //   e.preventDefault();
    //   window.scrollTo(0, scrollY);
    // }

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

    const options = { passive: false };

    // window.addEventListener("wheel", preventDefault, options);
    // window.addEventListener("touchmove", preventDefault, options); // 모바일 터치 스크롤도 막기
    // window.addEventListener("scroll", preventDefault, options);
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", keyDownHandler);

    return () => {
      // window.removeEventListener("wheel", preventDefault);
      // window.removeEventListener("touchmove", preventDefault);
      // window.removeEventListener("scroll", preventDefault);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [openNav, headRef]);

  return (
    <>
      <button className={`menu-bar`} onClick={buttonClickHandler}>
        <div className={`bar ${openNav ? "menu-on ro-t45" : ""}`} />
        <div className={`bar ${openNav ? "menu-on fadeout" : ""}`} />
        <div className={`bar ${openNav ? "menu-on ro-b45" : ""}`} />
      </button>
      <div
        className={`menu-overlay `}
        style={{
          right: openNav ? "0" : "-150%",
        }}
      />
      <aside
        className="menu-drawer"
        style={{
          right: openNav ? "0" : "-150%",
        }}
      >
        <section className="profile-section">
          <div className="profile-image-placeholder">
            <img
              src={current_user_photo || "./images/NoImage.png"}
              alt="User"
            ></img>
          </div>
          <button
            className="account-mgmt-btn"
            onClick={() => navigate("/user")}
          >
            계정관리
          </button>
          <button className="logout-btn" onClick={logoutHandler}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            &nbsp; <span>로그아웃</span>
          </button>
        </section>
        <hr className="menu-divider"></hr>
        <nav className="menu-nav">
          <ul>
            <li>
              <Link
                to="/tour?contentTypeId=12&areaCode=1&cat1=all&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">map</span>
                <span className="menu-text">관광지</span>
              </Link>
            </li>
            <li>
              <Link
                to="/culture?contentTypeId=14&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">
                  museum
                </span>
                <span className="menu-text">문화시설</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/festival?contentTypeId=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">
                  festival
                </span>
                <span className="menu-text">축제/공연/행사</span>
              </Link>
            </li>
            <li>
              <Link
                to="/travel?contentTypeId=25&areaCode=1&cat1=C01&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">route</span>
                <span className="menu-text">여행코스</span>
              </Link>
            </li>
            <li>
              <Link
                to="/culture?contentTypeId=28&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">
                  directions_bike
                </span>
                <span className="menu-text">레포츠</span>
              </Link>
            </li>
            <li>
              <Link
                to="/culture?contentTypeId=32&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">hotel</span>
                <span className="menu-text">숙박</span>
              </Link>
            </li>
            <li>
              <Link
                to="/culture?contentTypeId=38&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">
                  shopping_bag
                </span>
                <span className="menu-text">쇼핑</span>
              </Link>
            </li>
            <li>
              <Link
                to="/culture?contentTypeId=39&areaCode=1&cat1=A02&cat2=all&cat3=all&page=1"
                className="side-item"
                onClick={() => setOpenNav(false)}
              >
                <span className="material-icons-outlined menu-icon">
                  restaurant
                </span>
                <span className="menu-text">음식점</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};
export default MobileMenu;

// {current_user_id ? (
//     <div className="user-info-box">
//       <div>
//         <img src={current_user_photo} alt="User"></img>
//       </div>
//       <button className="manage-acc" onClick={() => navigate("/user")}>
//         계정관리
//       </button>
//       <button className="mo-logout" onClick={logoutHandler}>
//         <FontAwesomeIcon icon={faArrowRightFromBracket} />
//         &nbsp; 로그아웃
//       </button>
//     </div>
//   ) : (
//     <li>
//       <Link to="/login" className="side-item">
//         <FontAwesomeIcon icon={faRightFromBracket} />
//         &nbsp; 로그인
//       </Link>
//     </li>
//   )}
