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

  const initializeNaverLogin = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: "https://igotjeogot.kr/login/oauth",
      isPopup: false,
      loginButton: { color: "green", type: 3, height: "50" },
    });
    naverLogin.init();
  };

  const getNaverAccessToken = () => {
    const hash = window.location.hash.substring(1);

    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");

    return accessToken;
  };

  useEffect(() => {
    // Naver 컴포넌트 마운트, window.naver 객체 생성
    // 로그인 페이지 이동, 네이버 로그인 완료 후 콜백 url로 다시 로그인 페이지 이동(새로고침)
    initializeNaverLogin();
  }, []);

  useEffect(() => {
    const accessToken = getNaverAccessToken();
    if (!accessToken) return;

    const authenticateWithFirebase = async (token: string) => {
      // 2. 실제 서버 통신 직전에만 로딩 상태 활성화
      setLoading(true);
      try {
        const res: AxiosResponse<Auth> = await axios.get(
          `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/naver`,
          { headers: { authorization: token } }
        );

        const { firebaseToken } = res.data;
        await signInWithCustomToken(firebaseAuth, firebaseToken);
        // 로그인 성공 후 히스토리에서 콜백 URL을 제거하며 이동
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Naver login error:", error);
        alert("네이버 로그인에 실패했습니다.");
        navigate("/login", { replace: true }); // 에러 발생 시 로그인 페이지로 이동
      } finally {
        setLoading(false);
      }
    };

    authenticateWithFirebase(accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickHandler = () => {
    if (naverRef.current?.firstChild) {
      setLoading(true);
      (naverRef.current?.firstChild as HTMLImageElement).click();
    }
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
