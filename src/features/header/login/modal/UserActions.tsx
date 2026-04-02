import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserActions.module.css";
import userIcon from "assets/login/userIcon.png";

interface Props {
  user_name: string | null | undefined;
  user_photo: string | null | undefined;
  setUserModalOpen: (value: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  logout: () => Promise<void>;
}

const UserActions = ({
  user_name,
  user_photo,
  setUserModalOpen,
  containerRef,
  logout,
}: Props) => {
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear();
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUserModalOpen(false);
    }
  };

  const handlerUserLogs = () => {
    navigate("/user");
    setUserModalOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        divRef.current &&
        !divRef.current.contains(e.target as Node) &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setUserModalOpen(false);
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserModalOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <div className={styles["user-actions-container"]} ref={divRef}>
      <section className={styles["user-profile"]}>
        <figure className={styles["user-photo"]}>
          <img src={user_photo || userIcon} alt="userphoto" />
        </figure>
        <div className={styles["user-name"]}>
          <span>{`${user_name || "이름없음"}님`}</span>
        </div>
      </section>
      <section className={styles["actions"]}>
        <button onClick={handlerUserLogs} type="button">
          <span className="material-symbols-outlined">
            settings_account_box
          </span>
          <span>계정 활동 보기</span>
        </button>
        <button onClick={handleLogout} type="button">
          <span className="material-symbols-outlined">logout</span>
          <span>로그아웃</span>
        </button>
      </section>
    </div>
  );
};

export default UserActions;
