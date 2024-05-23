import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
} from "firebase/auth";
import Loading from "../components/loading/Loading";
import LoginAccessError from "../components/error/LoginAccessError";
import KakaoLogin from "../components/login/Kakao";
import Naver from "../components/login/Naver";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const loggedIn = auth.currentUser;

  const [loading, setLoading] = useState<boolean>(true);
  const previouseUrl = JSON.parse(sessionStorage.getItem("previouseUrl")!);

  const loginHandler = async (type: string) => {
    setLoading(true);
    let provider: AuthProvider | null = null;

    if (type === "Google") {
      provider = new GoogleAuthProvider();
    }

    if (type === "FaceBook") {
      provider = new FacebookAuthProvider();
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithRedirect(auth, provider!);
      })
      .catch((error) => {
        alert("로그인중에 오류가 발생했습니다!");
        console.log(error);
        navigate(previouseUrl ?? "/");
      });
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((userCredential) => {
        setLoading(false);
        if (userCredential) navigate(-2);
      })
      .catch((error: any) => {
        alert(`error is occured! ${error.code} ${error.message}`);
        console.log(error);
      });
  }, [navigate, previouseUrl, loading]);

  return (
    <>
      {loading && <Loading />}
      {loggedIn && <LoginAccessError />}
      {!loading && !loggedIn && (
        <form className="Login-Form">
          <h3 className="title">로그인</h3>
          <p id="p-tag">로그인 후 이용하실 수 있습니다.</p>
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
          <Naver />
        </form>
      )}
    </>
  );
};

export default LoginPage;
