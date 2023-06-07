import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";

interface T {
  openNav: boolean;
  setOpenNav: (value: boolean) => void;
}

const Side = ({ openNav, setOpenNav }: T) => {
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        setOpenNav(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className={`side-box-back ${openNav ? "back-on" : "back-off"}`}>
      <ul className={`side-box ${openNav ? "side-on" : "side-off"}`}>
        {!auth.currentUser && (
          <Link
            to="/login"
            className="side-item"
            onClick={() => setOpenNav(false)}
          >
            로그인
          </Link>
        )}
        {auth.currentUser && (
          <div className="mobile-login-box">
            <div>
              <img src={auth.currentUser.photoURL!} alt="User"></img>
            </div>
            <p className="mo-email">{auth.currentUser.email}</p>
            <p className="mo-logout" onClick={logoutHandler}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              &nbsp; 로그아웃
            </p>
          </div>
        )}
        <Link
          to="/tour/search?type=12&areaCode=1&cat1=all&cat2=all&cat3=all"
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          관광지
        </Link>
        <Link
          to="/culture/search?type=14&areaCode=1&cat1=A02&cat2=all&cat3=all"
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          문화시설
        </Link>
        <Link
          to={`/festival/search?type=15&month=${month}&areaCode=0&cat1=A02&cat2=all&cat3=all`}
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          축제/공연/행사
        </Link>
        <Link
          to="/travel/search?type=25&areaCode=1&cat1=C01&cat2=all&cat3=all"
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          여행코스
        </Link>
      </ul>
    </div>
  );
};
export default Side;
