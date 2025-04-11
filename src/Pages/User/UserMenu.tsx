import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";

interface T {
  openSide: boolean;
  setOpenSide: React.Dispatch<React.SetStateAction<boolean>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  user_photo: string;
  arrowRef: React.RefObject<HTMLDivElement>;
}

const UserMenu = ({
  openSide,
  setOpenSide,
  setCategory,
  user_photo,
  arrowRef,
}: T) => {
  const divRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`user-menu ${openSide ? "op" : ""}`} ref={divRef}>
      <h3>나의 활동</h3>
      <div className="user-icon">
        <div>
          <img src={user_photo} alt="user-icon" />
        </div>
        <div>
          <span>{"박완웅"}</span>
        </div>
      </div>
      <ul className="user-menu-list">
        <li onClick={() => setCategory("myComment")}>작성한 댓글 보기</li>
        <li onClick={() => setCategory("likedContent")}>좋아요 누른 콘텐츠</li>
        <li onClick={() => setCategory("likedComment")}>좋아요 누른 댓글</li>
      </ul>
      <div className="line" />
      <button className="log-out" type="button">
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>로그아웃</span>
      </button>
    </div>
  );
};

export default UserMenu;
