import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
} from "firebase/auth";
import "./Login.css";
import { useEffect, useState } from "react";
import Loading from "../components/ui/loading/Loading";
import LoginAccessError from "../components/error/LoginAccessError";
// import KakaoLogin from "../components/Login/Kakao";
// import Naver from "../components/Login/Naver";

const LoginPage = () => {
  const navigate = useNavigate();
  const loggedIn = auth.currentUser;
  // console.log(loggedIn);

  const [isFirst, setFirst] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const loginHandler = async (type: string) => {
    let provider: AuthProvider | null = null;
    setFirst(false);
    setLoading(true);
    if (type === "Google") {
      provider = new GoogleAuthProvider();
    }
    if (type === "FaceBook") {
      provider = new FacebookAuthProvider();
    }

    await signInWithRedirect(auth, provider!);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((credential) => {
        !credential && setLoading(false); 
        credential && navigate(-3);
      })
      .catch((error) => {
        console.log('???????')
        !isFirst && alert(error.message);
        !isFirst && navigate("/login", { replace: true });
        setLoading(false);
      });
  }, [isFirst, loggedIn, navigate]);

  return (
    <>
      {loading && <Loading />}
      {!loading && loggedIn && <LoginAccessError />}
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
          {/* <KakaoLogin setLoading={setLoading} /> */}
          {/* <Naver /> */}
          <Outlet />
        </form>
      )}
    </>
  );
};

export default LoginPage;
