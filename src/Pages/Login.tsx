import classes from "./Login.module.css";

const LoginPage = () => {
  return (
    <form className={classes["Login-Form"]}>
      <div className={classes.title}>로그인</div>
      <div className={classes["Social-Login-Box"]}>
        <img src="./Google.jpeg" alt="Google" width="25" height="25"></img>
        <span>구글 로그인</span>
      </div>
      <div className={classes["Social-Login-Box"]}>
        <img src="./Facebook.png" alt="Facebook" width="25" height="25"></img>
        <span>페이스북 로그인</span>
      </div>
    </form>
  );
};

export default LoginPage;
