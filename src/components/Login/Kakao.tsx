import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { auth as firebaseAuth } from "../../firebase/firestore";
import "../../Pages/Login.css";
import { signInWithCustomToken } from "firebase/auth";

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
  const { Kakao } = window;
  const searchParams = new URLSearchParams(document.location.search);
  const code = searchParams.get("code");

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
  }

  useEffect(() => {
    if (!code) {
      return;
    }
    const kakaoLoginAttempt = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse<Auth> = await axios.post(
          `${process.env.REACT_APP_SERVER_POINT}/kakao`,
          { code }
        );
        const { firebaseToken } = res.data;
        await signInWithCustomToken(firebaseAuth, firebaseToken);
        const currentUrl = sessionStorage.getItem('currentUrl');
        if (currentUrl) {
          navigate(-2);
        } else {
          navigate('/', { replace: true})
        }
      } catch (error: any) {
        alert(error.message);
        setLoading(false);
        navigate("/login");
      }
    };
    kakaoLoginAttempt();
  });

  const kakaoLoginHandler = () => {

    setLoading(true);
    Kakao.Auth.authorize({
      redirectUri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
      scope: "profile_nickname profile_image account_email",
    });
  };

  return (
    <div className="Social-Login Kakao" onClick={kakaoLoginHandler}>
      <img src="/images/kakao.png" alt="카카오 로그인 버튼" />
      <span>카카오톡 로그인</span>
    </div>
  );
};

export default KakaoLogin;
