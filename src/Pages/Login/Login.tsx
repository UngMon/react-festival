import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import LoadingThree from "../../components/Loading/LoadingThree";
import LoginAccessError from "../../components/Error/LoginAccessError";
import KakaoLogin from "./Kakao";
import Naver from "./Naver";
import LoginError from "./LoginError";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.firebase);
  const previouseUrl =
    JSON.parse(sessionStorage.getItem("previouseUrl")!) ?? "/";
  const [errorCode, setErrorCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(() => {
    const isRedirecting = sessionStorage.getItem("firebaseRedirect") === "true";
    console.log("Initial loading state check:", isRedirecting); // 디버깅용 로그
    return isRedirecting;
  });

  const loginHandler = async (type: string) => {
    setLoading(true);

    sessionStorage.setItem("firebaseRedirect", "true");

    try {
      await setPersistence(auth, browserSessionPersistence);
      let provider: AuthProvider | null = null;

      if (type === "Google") provider = new GoogleAuthProvider();

      if (type === "FaceBook") provider = new FacebookAuthProvider();

      //if (provider) await signInWithRedirect(auth, provider!);
       if (provider) await signInWithPopup(auth, provider!);
    } catch (error: any) {
      // 만약 리다이렉트 전에 에러가 발생하면, 남겼던 표식을 반드시 제거해야 합니다.
      setErrorCode(error.code);
      sessionStorage.removeItem("firebaseRedirect");
      setLoading(false); // 로딩 상태도 원상 복구
      navigate(previouseUrl, { replace: true });
    }
  };

  useEffect(() => {
    console.log("UseEffect", auth);
    const isRedirecting = sessionStorage.getItem("firebaseRedirect") === "true";

    if (isRedirecting) {
      getRedirectResult(auth)
        .then((result) => {
          console.log(result);
          if (result) {
            console.log("로그인 성공", result.user);
            navigate(previouseUrl, { replace: true });
          }
        })
        .catch((error) => {
          setErrorCode(error.code);
        })
        .finally(() => {
          setLoading(false);
          sessionStorage.removeItem("firebaseRedirect");
        });
    }
  }, [navigate, previouseUrl]);

  return (
    <>
      {loading && <LoadingThree />}
      {userData.user_id && <LoginAccessError />}
      {errorCode && (
        <LoginError errorCode={errorCode} setErrorCode={setErrorCode} />
      )}
      {!loading && !userData.user_id && (
        <form className="Login-Form">
          <h3 className="title">로그인</h3>
          <p id="p-tag">로그인 후 서비스를 이용하실 수 있습니다.</p>
          <div
            className="Social-Login Google"
            onClick={() => loginHandler("Google")}
          >
            <img src="/images/Google.jpeg" alt="Google"></img>
            <span>구글 로그인</span>
          </div>
          <div
            className="Social-Login Facebook"
            onClick={() => loginHandler("FaceBook")}
          >
            <img
              src="/images/Facebook.png"
              alt="Facebook"
              width="25"
              height="25"
            ></img>
            <span>페이스북 로그인</span>
          </div>
          <KakaoLogin setLoading={setLoading} />
          <Naver setLoading={setLoading} />
        </form>
      )}
    </>
  );
};

export default LoginPage;
