import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import {
  loginWithFirebase,
  loginWithKakao,
  loginWithNaver,
} from "utils/login_utils";
import LoadingThree from "../../components/Common/Loading/LoadingThree";
import LoginAccessError from "../../components/Common/Error/LoginAccessError";
import Kakao from "./Kakao";
import Naver from "./Naver";
import LoginError from "./LoginError";
import GoolgeAndFaceBook from "./GoogleAndFaceBook";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const current_user_id = useSelector(
    (state: RootState) => state.firebase.current_user_id,
  );

  const [errorCode, setErrorCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const finalizeLogin = useCallback(() => {
    const previousUrl = JSON.parse(
      sessionStorage.getItem("previousUrl") || '"/"',
    );
    navigate(previousUrl, { replace: true });
  }, [navigate]);

  // 세션 스토리지에 Login_Type = Google, Facebook, Kakao, Naver 이렇게 추가하기
  // 세션 스트로지 firebaseRedirect는 그냥 없애도록 합시다. ㅇㅋ?

  const authCallbackHandler = useCallback(async () => {
    const Login_Type = JSON.parse(sessionStorage.getItem("Login_Type") || "");

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

  if (current_user_id) return <LoginAccessError />;

  return (
    <>
      {loading && <LoadingThree />}
      {!loading && (
        <form className="Login-Form">
          <h3 className="title">로그인</h3>
          <p id="p-tag">로그인 후 서비스를 이용하실 수 있습니다.</p>
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
    </>
  );
};

export default LoginPage;
