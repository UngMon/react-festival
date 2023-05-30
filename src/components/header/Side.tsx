import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";

interface T {
  setOpenNav: (value: boolean) => void;
}

const Side = ({ setOpenNav }: T) => {
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
  console.log(auth)
  return (
    <div className="side-box-back">
      <ul className="side-box">
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
          to="/tour/search?areaCode=1&cat1=all&cat2=all&cat3=all"
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          관광지
        </Link>
        <Link
          to="/culture/search?areaCode=1&cat1=all&cat2=all&cat3=all"
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          문화시설
        </Link>
        <Link
          to={`/festival/search?month=${month}&areaCode=0&cat1=all&cat2=all&cat3=all`}
          className="side-item"
          onClick={() => setOpenNav(false)}
        >
          축제/공연/행사
        </Link>
        <Link
          to="/travel/search?areaCode=1&cat1=all&cat2=all&cat3=all"
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
