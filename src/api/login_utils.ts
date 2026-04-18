import { auth } from "../firebase";
import {
  browserSessionPersistence,
  setPersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  signInWithCustomToken,
  getRedirectResult,
} from "firebase/auth";

declare global {
  interface Window {
    Kakao: any;
  }

  interface Window {
    naver: any;
  }
}

export const redirectGoogleAndFacebook = async (providerName: string) => {
  try {
    sessionStorage.setItem("Login_Type", "Firebase");

    await setPersistence(auth, browserSessionPersistence);
    const provider =
      providerName === "google.com"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    await signInWithRedirect(auth, provider);
  } catch (error) {
    sessionStorage.removeItem("Login_Type");
    // 에러를 다시 던져서 컴포넌트가 UI 처리를 할 수 있게 한다.
    throw error;
  }
};

export const loginWithFirebase = async () => {
  try {
    await getRedirectResult(auth);
  } catch (error) {
    throw error;
  }
};

const initKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
  }
};

export const redirectKakaoLogin = () => {
  sessionStorage.setItem("Login_Type", "Kakao");

  initKakao();
  window.Kakao.Auth.authorize({
    redirectUri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
    throughTalk: false, // 카카오톡 앱 실행 시도 없이 웹뷰로 로그인 진행
  });
};

export const loginWithKakao = async () => {
  try {
    const searchParams = new URLSearchParams(document.location.search);
    const authorizeCode = searchParams.get("code");

    if (!authorizeCode) {
      throw new Error(`인가코드가 존재하지 않습니다.`);
    }

    // 1. 서버에 토큰 요청
    const response = await fetch(
      `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/kakao`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorizeCode }),
      },
    );

    if (!response.ok) {
      // 서버 에러 응답 처리
      const errorData = await response.json();
      const error = new Error(errorData.message) as any;
      error.code = "auth/kakao-server-error";
      throw error;
    }

    const { firebaseToken } = await response.json();
    await signInWithCustomToken(auth, firebaseToken);
  } catch (error: any) {
    // 에러를 UI 컴포넌트에 던지기

    if (!error.code) {
      error.code = "auth/kakao-login-failed";
    }
    throw error;
  }
};

export const initializeNaverLogin = () => {
  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
    callbackUrl: "https://igotjeogot.kr/login/oauth",
    isPopup: false,
    loginButton: { color: "green", type: 3, height: "50" },
  });
  naverLogin.init();
};

export const redirectNaverLogin = (): HTMLElement => {
  initializeNaverLogin();
  const naverId = "naverIdLogin";
  let naverDiv = document.getElementById(naverId);

  if (!naverDiv) {
    naverDiv = document.createElement("div");
    naverDiv.id = naverId;
    naverDiv.style.display = "none"; // 보이지 않게 숨김
    document.body.appendChild(naverDiv);
  }

  sessionStorage.setItem("Login_Type", "Naver");

  return naverDiv;
};

export const loginWithNaver = async () => {
  try {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      throw new Error(`엑세스 토큰이 존재하지 않습니다.`);
    }

    const response = await fetch(
      `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/naver`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(
        errorData.message || "네이버 인증 서버 통신 실패",
      ) as any;
      error.code = "auth/naver-server-error";
      throw error;
    }

    const data = await response.json();
    const { firebaseToken } = data;

    await signInWithCustomToken(auth, firebaseToken);
  } catch (error: any) {
    if (!error.code) {
      error.code = "auth/naver-login-failed";
    }
    throw error;
  }
};

// 1. 인증 fresh 체크
export const isAuthFresh = async () => {
  const user = auth.currentUser;
  if (!user) return false;

  const tokenResult = await user.getIdTokenResult(true);
  const authTime = new Date(tokenResult.authTime).getTime();
  const now = Date.now();

  // 로그인 후 시간이 1시간 (3,600,000ms) 이내면 ok
  return now - authTime < 60 * 60 * 1000;
};

// 3. 실제 서버 API를 호출하는 함수
export const executeWithdrawal = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("로그인된 사용자 정보가 없습니다.");

    const idToken = await user.getIdToken(true);

    const reponse = await fetch(
      `${process.env.REACT_APP_FIREBASE_SERVER_POINT}/withdraw`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (reponse.ok) {
      alert("회원 탈퇴가 완료되었습니다.");
    } else {
      const errorText = await reponse.text();
      console.error("Withdrawal failed:", errorText);
      alert("탈퇴 처리 중 문제가 발생했습니다.");
    }
  } catch (error: any) {
    console.error("Network error:", error);
    alert(`서버와 통신할 수 없습니다.`);
  }
};
