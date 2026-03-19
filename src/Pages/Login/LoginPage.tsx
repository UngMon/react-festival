import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithFirebase,
  loginWithKakao,
  loginWithNaver,
} from "utils/login_utils";
import LoadingThree from "../../common/loading/LoadingThree";
import Kakao from "../../features/auth/Kakao";
import Naver from "../../features/auth/Naver";
import LoginError from "../../features/auth/LoginError";
import GoolgeAndFaceBook from "../../features/auth/GoogleAndFaceBook";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorCode, setErrorCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  console.log('LoginPage')
  const finalizeLogin = useCallback(() => {
    const previousUrl = sessionStorage.getItem("previousUrl") || '/';
    navigate(`/${previousUrl}`, { replace: true });
  }, [navigate]);

  const authCallbackHandler = useCallback(async () => {
    const Login_Type = sessionStorage.getItem("Login_Type");

    try {
      // A. 구글 / 페이스북 (Firebase Redirect)
      if (Login_Type === "Firebase") {
        await loginWithFirebase();
        return finalizeLogin();
      }

      // B. Kakao (Query Params)
      if (Login_Type === "Kakao") {
        await loginWithKakao(); // 카카오 로그인 유틸 함수
        return finalizeLogin();
      }

      // C. Naver (Hash Params)
      if (Login_Type === "Naver") {
        await loginWithNaver();
        return finalizeLogin();
      }
    } catch (error: any) {
      console.error("Redirect Result Error:", error);
      setErrorCode(error.code || "auth/login-failed");
    } finally {
      setLoading(false);
      sessionStorage.removeItem("Login_Type");
    }
  }, [finalizeLogin]);

  useEffect(() => {
    authCallbackHandler();
  }, [authCallbackHandler]);

  return (
    <div className="login-container">
      {loading && <LoadingThree />}
      {!loading && (
        <form className="login-section">
          <h3 className="login-title">로그인</h3>
          <p id="login-sub-text">소셜 플랫폼으로 로그인 하실 수 있습니다!</p>
          <GoolgeAndFaceBook
            setLoading={setLoading}
            setErrorCode={setErrorCode}
          />
          <Kakao setLoading={setLoading} />
          <Naver setLoading={setLoading} />
        </form>
      )}
      {errorCode && (
        <LoginError errorCode={errorCode} setErrorCode={setErrorCode} />
      )}
    </div>
  );
};

export default LoginPage;
