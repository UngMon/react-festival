import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "store/store";
import { firebaseActions } from "store/firebase-slice";
import styles from "./UserActions.module.css";
import { useEffect, useRef } from "react";

interface Props {
  current_user_name: string;
  current_user_photo: string;
  setUserModalOpen: (value: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const UserActions = ({
  current_user_name,
  current_user_photo,
  setUserModalOpen,
  containerRef,
}: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      sessionStorage.clear();
      dispatch(firebaseActions.logout());
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUserModalOpen(false);
    }
  };

  const handlerUserLogs = () => {
    navigate("/user");
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
          <img src={current_user_photo} alt="userphoto" />
        </figure>
        <div className={styles["user-name"]}>
          <span>{`${current_user_name}님`}</span>
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
