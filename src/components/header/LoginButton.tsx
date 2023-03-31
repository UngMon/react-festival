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
    signOut(auth).then(() => {
      dispatch(firebaseActions.logOutUser());
    }).catch((err) => {
      alert(err.message);
    })
  };

  return (
    <>
      {!firebaseState.userUid && <button className={classes.button} onClick={loginHandler}>
        로그인
      </button>}
      {firebaseState.userUid && <button className={classes.button} onClick={logoutHnalder}>
        로그아웃
      </button>}
    </>
  );
};

export default LoginButton;
