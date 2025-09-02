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
  const { user_photo, user_name } = userData;
  const boxRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [openSide, setOpenSide] = useState<boolean>(false);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (arrowRef.current?.contains(target)) return;

      if (openSide && !boxRef.current?.contains(target)) {
        setOpenSide(false);
      }
    };

    const resizeHandler = () => {
      if (window.innerWidth >= 1024 && openSide) {
        setOpenSide(false);
        const menuBox = boxRef.current;
        if (menuBox) menuBox.classList.remove();
      }
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  });

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
        className="user-menu-arrow"
        onClick={() => setOpenSide(true)}
        ref={arrowRef}
      >
        <FontAwesomeIcon icon={faRightLong} />
      </div>
      <div className={`user-menu ${openSide ? "op" : "of"}`} ref={boxRef}>
        <h3>나의 활동</h3>
        <div className="user-icon">
          <div>
            <img src={user_photo} alt="user-icon" />
          </div>
          <div>
            <span>{user_name}</span>
          </div>
        </div>
        <ul className="user-menu-list">
          <li onClick={() => setCategory("myComment")}>작성한 댓글 보기</li>
          <li onClick={() => setCategory("likedContent")}>
            좋아요 누른 콘텐츠
          </li>
          <li onClick={() => setCategory("likedComment")}>좋아요 누른 댓글</li>
        </ul>
        <div className="line" />
        <button className="log-out" type="button" onClick={logoutHandler}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>로그아웃</span>
        </button>
      </div>
    </>
  );
};

export default UserMenu;
