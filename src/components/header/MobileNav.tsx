import { useEffect } from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch } from "../../redux/store";
import { firebaseActions } from "../../redux/firebase-slice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./MobileNav.css";

interface T {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
}

const MobileNav = ({ openNav, setOpenNav }: T) => {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (!openNav) return;

    const resizeHandler = () => {

      if (window.innerWidth >= 1024) setOpenNav(false);
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [openNav, setOpenNav]);

  return (
    <div className="side-container">
      <div
        className="side-background"
        style={{
          right: openNav ? "0" : "-150%",
        }}
      />
      <ul
        className="side"
        style={{
          right: openNav ? "0" : "-150%",
        }}
      >
        {!auth.currentUser ? (
          <li>
            <Link
              to="/login"
              className="side-item"
              onClick={() => setOpenNav(false)}
            >
              로그인
            </Link>
          </li>
        ) : (
          <li className="user-info-box">
            <div>
              <img src={auth.currentUser.photoURL!} alt="User"></img>
            </div>
            <p className="mo-email">{auth.currentUser.email}</p>
            <button className="mo-logout" onClick={logoutHandler}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              &nbsp; 로그아웃
            </button>
          </li>
        )}
        <li>
          <Link
            to="/tour?type=12&areaCode=1&cat1=all&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            관광지
          </Link>
        </li>
        <li>
          <Link
            to="/culture?type=14&areaCode=1&cat1=A02&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            문화시설
          </Link>
        </li>
        <li>
          <Link
            to={`/festival?type=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            축제/공연/행사
          </Link>
        </li>
        <li>
          <Link
            to="/travel?type=25&areaCode=1&cat1=C01&cat2=all&cat3=all"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            여행코스
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default MobileNav;
