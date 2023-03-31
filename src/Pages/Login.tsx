import { useNavigate } from "react-router-dom";
import KakaoLogin from "../components/Login/Kakao";
import { auth } from "../firebase/firestore";
import {
  signInWithRedirect,
  browserSessionPersistence,
  setPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
} from "firebase/auth";
import "./Login.css";
import { useAppDispatch } from "../redux/store";
import { firebaseActions } from "../redux/firebase-slice";
import { useEffect, useState } from "react";
import Loading from "../components/UI/Loading";

let isFirst = true;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const loginHandler = (type: string) => {
    let provider: AuthProvider | null = null;
    isFirst = false;

    if (type === "Google") {
      provider = new GoogleAuthProvider();
    }
    if (type === "FaceBook") {
      provider = new FacebookAuthProvider();
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithRedirect(auth, provider!);
        setLoading(true);
      })
      .catch((error) => {
        navigate("/login");
        alert(error.message);
      });
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((credential) => {
        const { uid, displayName } = credential!.user;
        dispatch(firebaseActions.setUserData({ uid, displayName }));
        navigate("/");
      })
      .catch((error) => {
        !isFirst && alert(error.message);
        navigate("/login");
        setLoading(false);
      });
  }, [dispatch, navigate]);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <form className="Login-Form">
          <div className="title">로그인</div>
          <div
            className="Google-Login-Box"
            onClick={() => loginHandler("Google")}
          >
            <img
              src="/images/Google.jpeg"
              alt="Google"
              width="25"
              height="25"
            ></img>
            <span>구글 로그인</span>
          </div>
          <div
            className="Social-Login-Box"
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
          <KakaoLogin />
        </form>
      )}
    </>
  );
};

export default LoginPage;
