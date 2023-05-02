import "./LoginAccessError.css";

const LoginAccessError = () => {

  return (
    <div className="Login-Access-Error">
      <p>이미 로그인 하셨습니다!</p>
      <p>다른 계정을 이용하시려면 로그아웃 해주세요!</p>
    </div>
  );
};

export default LoginAccessError;
