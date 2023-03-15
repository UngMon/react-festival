import { useNavigate } from "react-router-dom";
import classes from "./LoginButton.module.css";

const LoginButton = () => {
  const navigate = useNavigate();

  const loginHandler = () => {
    navigate("/login");
  };

  return (
    <button className={classes.button} onClick={loginHandler}>
      로그인
    </button>
  );
};

export default LoginButton;
