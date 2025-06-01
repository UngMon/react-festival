import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch } from "../../store/store";
import { firebaseActions } from "../../store/firebase-slice";

interface T {
  openSide: boolean;
  setOpenSide: React.Dispatch<React.SetStateAction<boolean>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  user_photo: string;
  user_name: string;
  user_email: string;
  arrowRef: React.RefObject<HTMLDivElement>;
}

const UserMenu = ({
  openSide,
  setOpenSide,
  setCategory,
  user_photo,
  user_name,
  user_email,
  arrowRef,
}: T) => {
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (arrowRef.current?.contains(target)) return;

      if (openSide && !divRef.current?.contains(target)) {
        setOpenSide(false);
      }
    };

    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth >= 1024 && openSide) {
        setOpenSide(false);
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
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
    <div className={`user-menu ${openSide ? "op" : ""}`} ref={divRef}>
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
        <li onClick={() => setCategory("likedContent")}>좋아요 누른 콘텐츠</li>
        <li onClick={() => setCategory("likedComment")}>좋아요 누른 댓글</li>
      </ul>
      <div className="line" />
      <button className="log-out" type="button" onClick={logoutHandler}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>로그아웃</span>
      </button>
    </div>
  );
};

export default UserMenu;
