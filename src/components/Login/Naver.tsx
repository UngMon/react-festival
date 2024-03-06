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

const Naver = () => {
  const navigate = useNavigate();
  const naverRef = useRef<HTMLDivElement>(null);

  const naverLoginHandler = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: "zIpz_Z5aDY2cR2BnNs8L",
      callbackUrl: "http://localhost:3000/login/oauth",
      isPopup: false,
      loginButton: { color: "green", type: 3, height: "50" },
      callbackHandle: true,
    });

    naverLogin.init();
    return naverLogin?.accessToken?.accessToken;
  };

  useEffect(() => {
    const token = naverLoginHandler();
    if (!token) return;

    const getDataUser = async () => {
      try {
        const res: AxiosResponse<Auth> = await axios.get(
          `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/naver?token=${token}`,
          { headers: { Authorization: token } }
        );
        const { firebaseToken } = res.data;
        await signInWithCustomToken(firebaseAuth, firebaseToken);
        navigate("/", { replace: true });
      } catch (error: any) {
        navigate("/");
        alert("네이버 로그인중에 오류가 발생했습니다.");
      }
    };
    getDataUser();
  });

  const clickHandler = () => {
    if (!naverRef.current || !naverRef.current.children) return;
    (naverRef.current.firstChild as HTMLImageElement).click();
  };

  return (
    <div>
      <div className="Social-Login Naver" onClick={clickHandler}>
        <img src="/images/naver.png" alt="네이버 아이콘" />
        <span>네이버 로그인</span>
      </div>
      <div id="naverIdLogin" ref={naverRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default Naver;
