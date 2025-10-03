import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { auth as firebaseAuth } from "../../firebase";
import { signInWithCustomToken } from "firebase/auth";
import "./LoginPage.css";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface Auth {
  firebaseToken: string;
}

type KakaoProps = {
  setLoading: (bool: boolean) => void;
};

const KakaoLogin = ({ setLoading }: KakaoProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const authorizeCode = searchParams.get("code");

    if (!authorizeCode) return;

    const kakaoLoginAttempt = async () => {
      setLoading(true);

      try {
        const response: AxiosResponse<Auth> = await axios.post(
          `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/kakao`,
          { authorizeCode }
        );
        const { firebaseToken } = response.data;
        await signInWithCustomToken(firebaseAuth, firebaseToken);
        navigate("/", { replace: true });
      } catch (error: any) {
        setLoading(false);
        navigate("/", { replace: true });
      }
    };

    kakaoLoginAttempt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kakaoLoginHandler = () => {
    // 카카오 버튼을 누르면 카카오 서버로부터 로그인 페이지를 요청,
    setLoading(true);
    window.Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
    });
  };

  return (
    <div>
      <button className="Social-Login Kakao" onClick={kakaoLoginHandler}>
        <img src="/images/kakao.png" alt="카카오 로그인 버튼" />
        <span>카카오톡 로그인</span>
      </button>
    </div>
  );
};

export default KakaoLogin;
