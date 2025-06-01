import { useState } from "react";
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
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import LoadingThree from "../../components/Loading/LoadingThree";
import LoginAccessError from "../../components/Error/LoginAccessError";
import KakaoLogin from "./Kakao";
import Naver from "./Naver";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state.firebase);
  const previouseUrl = JSON.parse(sessionStorage.getItem("previouseUrl")!);
  console.log(auth);
  const loginHandler = async (type: string) => {
    setLoading(true);

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        let provider: AuthProvider | null = null;

        if (type === "Google") {
          provider = new GoogleAuthProvider();
        }

        if (type === "FaceBook") {
          provider = new FacebookAuthProvider();
        }

        signInWithPopup(auth, provider!).then((result) => {
          console.log('result')
          navigate(previouseUrl, { replace: true });
        }).catch((error: any) => {
          console.log(error);
          alert(error);
        })

        // signInWithRedirect(auth, provider!)
        //   .then((data) => {
        //     console.log(data);
        //     navigate(previouseUrl, { replace: true });
        //   })
        //   .catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // The email of the user's account used.
        //     // The AuthCredential type that was used.
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        //     console.error(credential, errorCode, errorMessage);
        //   });
      })
      .catch((error) => {
        alert("로그인중에 오류가 발생했습니다!");
        console.log(error);
        navigate(previouseUrl ?? "/");
      });
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingThree />}
      {userData.user_id && <LoginAccessError />}
      {!loading && !userData.user_id && (
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
          <Naver setLoading={setLoading} />
        </form>
      )}
    </>
  );
};

export default LoginPage;
