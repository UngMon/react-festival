import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { auth as firebaseAuth } from "../../firebase";
import { signInWithCustomToken } from "firebase/auth";

declare global {
  interface Window {
    naver: any;
  }
}

interface Auth {
  firebaseToken: string;
}

type NaverProps = {
  setLoading: (bool: boolean) => void;
};

const Naver = ({ setLoading }: NaverProps) => {
  const navigate = useNavigate();
  const naverRef = useRef<HTMLDivElement>(null);

  const naverLoginHandler = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: "https://igotjeogot.kr/login/oauth",
      isPopup: false,
      loginButton: { color: "green", type: 3, height: "50" },
      callbackHandle: true,
    });

    naverLogin.init();
    return naverLogin?.accessToken?.accessToken;
  };

  useEffect(() => {
    const access_token = naverLoginHandler();
    if (!access_token) return;

    const getDataUser = async () => {
      try {
        setLoading(true);

        const res: AxiosResponse<Auth> = await axios.get(
          `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/naver`,
          { headers: { authorization: access_token } }
        );
    
        const { firebaseToken } = res.data;
        await signInWithCustomToken(firebaseAuth, firebaseToken);
        navigate("/", { replace: true });
      } catch (error: any) {
        console.error(error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    getDataUser();
  });

  const clickHandler = () => {
    if (!naverRef.current || !naverRef.current.children) return;
    setLoading(true);
    (naverRef.current.firstChild as HTMLImageElement).click();
  };

  return (
    <div>
      <button className="Social-Login Naver" onClick={clickHandler}>
        <img src="/images/naver.png" alt="네이버 아이콘" />
        <span>네이버 로그인</span>
      </button>
      <div id="naverIdLogin" ref={naverRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default Naver;
