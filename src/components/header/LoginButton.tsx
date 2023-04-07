import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firestore";
import { firebaseActions } from "../../redux/firebase-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import classes from "./LoginButton.module.css";

const LoginButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const firebaseState = useSelector((state: RootState) => state.firebase);

  const loginHandler = () => {
    navigate("/login");
  };

  const logoutHnalder = () => {
    signOut(auth)
      .then(() => {
        dispatch(firebaseActions.logOutUser());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <>
      {!firebaseState.userChecking ? ( // onAuthState에서 유저 정보를 확인했고,
        !firebaseState.userUid ? ( // 로그인 안 되어 있으면,
          <div className={classes.login} onClick={loginHandler}>
            <img src="/images/user.png" alt="user"></img>
            <p>로그인</p>
          </div>
        ) : (
          // 로그인 상태일 때
          <button className={classes.logout} onClick={logoutHnalder}>
            로그아웃
          </button>
        )
      ) : (
        // 새로고침시 잠깐동안 다른 ui보여줌
        <div className={classes["not-Login"]}></div>
      )}
    </>
  );
};

export default LoginButton;
