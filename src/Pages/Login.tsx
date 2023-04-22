import { Outlet, useNavigate } from "react-router-dom";
import KakaoLogin from "../components/Login/Kakao";
import { auth } from "../firebase/firestore";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
} from "firebase/auth";
import "./Login.css";
import { RootState, useAppDispatch } from "../redux/store";
import { firebaseActions } from "../redux/firebase-slice";
import { useEffect, useState } from "react";
import Loading from "../components/UI/Loading";
import { useSelector } from "react-redux";
import LoginAccessError from "../components/Error/LoginAccessError";

let isFirst = true;

const LoginPage = () => {
  console.log("loginpage");
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.firebase.loginedUser
  );
  


  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  const loginHandler = async (type: string) => {
    let provider: AuthProvider | null = null;
    isFirst = false;
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
    // if (isUserLoggedIn) {
    //   const prevPage = sessionStorage.getItem('currentUrl');
    //   navigate(`${JSON.parse(prevPage!)}`, { replace: true})
    //   return;
    // }

    getRedirectResult(auth)
      .then((credential) => {
        const { uid, email, displayName, photoURL } = credential!.user;
        dispatch(
          firebaseActions.setUserData({ uid, email, displayName, photoURL })
        );
        navigate("/");
      })
      .catch((error) => {


        console.log(error);
        !isFirst && alert(error.message);
        !isFirst && navigate("/login", { replace: true });
        setLoading(false);
      });
  }, [dispatch, navigate, isUserLoggedIn]);

  return (
    <>
      {loading && <Loading />}
      {!loading && isUserLoggedIn && <LoginAccessError />}
      {!loading && !isUserLoggedIn && (
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
          <Outlet />
        </form>
      )}
    </>
  );
};

export default LoginPage;
