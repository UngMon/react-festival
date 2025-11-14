import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getRedirectResult } from "firebase/auth";
import LoadingThree from "../../components/Loading/LoadingThree";
import LoginAccessError from "../../components/Error/LoginAccessError";
import KakaoLogin from "./Kakao";
import Naver from "./Naver";
import LoginError from "./LoginError";
import GoolgeAndFaceBook from "./GoogleAndFaceBook";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const current_user_id = useSelector(
    (state: RootState) => state.firebase.current_user_id
  );
  const [errorCode, setErrorCode] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(() => {
    const isRedirecting = sessionStorage.getItem("firebaseRedirect") === "true";
    return isRedirecting;
  });

  useEffect(() => {
    const isRedirecting = sessionStorage.getItem("firebaseRedirect") === "true";
    const previouseUrl =
      JSON.parse(sessionStorage.getItem("previouseUrl")!) ?? "/";

    if (isRedirecting) {
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <LoadingThree />}
      {current_user_id ? (
        <LoginAccessError />
      ) : (
        !loading && (
          <form className="Login-Form">
            <GoolgeAndFaceBook
              setLoading={setLoading}
              setErrorCode={setErrorCode}
            />
            <KakaoLogin setLoading={setLoading} />
            <Naver setLoading={setLoading} />
          </form>
        )
      )}
      {errorCode && (
        <LoginError errorCode={errorCode} setErrorCode={setErrorCode} />
      )}
    </>
  );
};

export default LoginPage;
