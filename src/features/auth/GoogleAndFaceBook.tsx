import { redirectGoogleAndFacebook } from "utils/login_utils";
import google_logo from "../../assets/login/google_logo.jpeg";
import facebook_logo from "../../assets/login/facebook_logo.png";

interface T {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorCode: React.Dispatch<React.SetStateAction<string>>;
}

const SOCIAL_CONFIG = [
  {
    id: "Google",
    label: "구글 로그인",
    img: google_logo,
    provider: "google.com",
  },
  {
    id: "Facebook",
    label: "페이스북 로그인",
    img: facebook_logo,
    provider: "facebook.com",
  },
] as const;

const GoolgeAndFaceBook = ({ setLoading, setErrorCode }: T) => {
  const loginHandler = async (type: string) => {
    setLoading(true); // UI: 로딩 시작

    try {
      await redirectGoogleAndFacebook(type);
    } catch (error: any) {
      // 만약 리다이렉트 전에 에러가 발생하면, 남겼던 표식을 반드시 제거해야 한다.
      setLoading(false); // UI: 로딩 해제
      sessionStorage.removeItem("firebaseRedirect");
      setErrorCode(error.code || "auth/redirect-failed");
    }
  };

  return (
    <>
      {SOCIAL_CONFIG.map((social) => (
        <div className="log-but-box" key={social.id}>
          <button
            className={`login-button ${social.id}`}
            onClick={() => {
              loginHandler(social.provider);
            }}
          >
            <img src={social.img} alt={social.id}></img>
            <span>{social.label}</span>
          </button>
        </div>
      ))}
    </>
  );
};

export default GoolgeAndFaceBook;
