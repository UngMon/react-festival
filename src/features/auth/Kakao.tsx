import { redirectKakaoLogin } from "api/login_utils";
import kakao_logo from "../../assets/login/kakao_logo.png";

type KakaoProps = {
  setLoading: (bool: boolean) => void;
};

const Kakao = ({ setLoading }: KakaoProps) => {
  const loginHandler = () => {
    setLoading(true);
    redirectKakaoLogin(); // 카카오 서버로 이동
  };

  return (
    <button
      type="button"
      className={"login-button Kakao"}
      onClick={loginHandler}
    >
      <img src={kakao_logo} alt="카카오 로그인 버튼" width={"50px"} />
      <span>카카오톡 로그인</span>
    </button>
  );
};

export default Kakao;
