import { redirectKakaoLogin } from "utils/login_utils";
import "./LoginPage.css";

type KakaoProps = {
  setLoading: (bool: boolean) => void;
};

const Kakao = ({ setLoading }: KakaoProps) => {
  const loginHandler = () => {
    setLoading(true);
    redirectKakaoLogin(); // 카카오 서버로 이동
  };

  return (
    <div>
      <button className="Social-Login Kakao" onClick={loginHandler}>
        <img src="/images/kakao_logo.png" alt="카카오 로그인 버튼" />
        <span>카카오톡 로그인</span>
      </button>
    </div>
  );
};

export default Kakao;
