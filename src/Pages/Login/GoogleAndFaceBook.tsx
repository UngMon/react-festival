import { auth } from "../../firebase";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  AuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithPopup,
//   signInWithRedirect,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

interface T {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorCode: React.Dispatch<React.SetStateAction<string>>;
}

const providerMap: { [key: string]: AuthProvider } = {
  Google: new GoogleAuthProvider(),
  Facebook: new FacebookAuthProvider(),
};

const GoolgeAndFaceBook = ({ setLoading, setErrorCode }: T) => {
  const navigate = useNavigate();

  const loginHandler = async (type: string) => {
    setLoading(true);

    sessionStorage.setItem("firebaseRedirect", "true");

    try {
      await setPersistence(auth, browserSessionPersistence);
      let provider: AuthProvider | null = providerMap[type];

      //if (provider) await signInWithRedirect(auth, provider);
      if (provider) await signInWithPopup(auth, provider);
    } catch (error: any) {
      // 만약 리다이렉트 전에 에러가 발생하면, 남겼던 표식을 반드시 제거해야 합니다.
      setErrorCode(error.code);
      sessionStorage.removeItem("firebaseRedirect");
      setLoading(false); // 로딩 상태도 원상 복구
      navigate('/', { replace: true });
    }
  };

  return (
    <>
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
    </>
  );
};

export default GoolgeAndFaceBook;
