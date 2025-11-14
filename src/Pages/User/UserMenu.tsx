import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch } from "../../store/store";
import { firebaseActions } from "../../store/firebase-slice";
import { UserData } from "type/UserDataType";
import "./UserMenu.css";

interface T {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  userData: UserData;
}

const UserMenu = ({ setCategory, userData }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const { current_user_photo, current_user_name } = userData;
  const [openSide, setOpenSide] = useState<boolean>(false);

  useEffect(() => {
    const menuTag = menuRef.current;

    if (!menuTag) return;

    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (arrowRef.current?.contains(target)) return;

      if (openSide && !menuTag.contains(target)) setOpenSide(false);
    };

    const resizeHandler = () => {
      if (window.innerWidth >= 1024 && openSide) {
        setOpenSide(false);
        menuTag.style.transition = "none";
      }
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [openSide]);

  const openMenuHandler = () => {
    const menuTag = menuRef.current;
    if (!menuTag) return;

    setOpenSide((prevState) => !prevState);

    if (!openSide) menuTag.style.transition = "all 0.3s ease-in-out";
    else
      setTimeout(() => {
        menuTag.style.transition = "none";
      }, 300);
  };

  const logoutHandler = async () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        dispatch(firebaseActions.logout());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      <div
        className={`user-menu-arrow ${openSide ? "a-op" : ""}`}
        onClick={openMenuHandler}
        ref={arrowRef}
      >
        <FontAwesomeIcon icon={faRightLong} />
      </div>
      <div className="menu-container ">
        <div className={`user-menu ${openSide ? "op" : ""}`} ref={menuRef}>
          <h3>나의 활동</h3>
          <div className="user-icon">
            <div>
              <img src={current_user_photo} alt="user-icon" />
            </div>
            <div>
              <span>{current_user_name}</span>
            </div>
          </div>
          <ul className="user-menu-list">
            <li>
              <button onClick={() => setCategory("myComment")}>
                작성한 댓글 보기
              </button>
            </li>
            <li>
              <button onClick={() => setCategory("likedContent")}>
                좋아요 누른 콘텐츠
              </button>
            </li>
            <li>
              <button onClick={() => setCategory("likedComment")}>
                좋아요 누른 댓글
              </button>
            </li>
          </ul>
          <div className="line" />
          <button className="log-out" type="button" onClick={logoutHandler}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
