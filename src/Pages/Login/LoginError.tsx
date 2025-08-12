import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import WebName from "../../components/Header/WebName";
import "./LoginError.css";

interface T {
  errorCode: string;
  setErrorCode: React.Dispatch<React.SetStateAction<string>>;
}

const LoginError = ({ errorCode, setErrorCode }: T) => {
  const firebaseAuthErrors: Record<string, string> = {
    "auth/invalid-email": "이메일 형식이 올바르지 않아요.",
    "auth/wrong-password": "비밀번호가 일치하지 않아요.",
    "auth/email-already-in-use": "이미 사용 중인 이메일이에요.", // createUserWithEmailAndPassword 에서 발생
    "auth/email-already-exists": "이미 사용 중인 이메일이에요.", // Admin SDK 에서 발생
    "auth/weak-password": "비밀번호는 6자리 이상이어야 해요.",
    "auth/too-many-requests": "잠시 후 다시 시도해 주세요.",
    "auth/popup-closed-by-user":
      "로그인 팝업 창을 닫으셨어요. 다시 시도해 주세요.",
    "auth/popup-blocked-by-browser":
      "브라우저가 팝업을 차단했어요. 팝업을 허용해 주세요.",
    "auth/operation-not-allowed":
      "로그인이 허용되지 않은 방식이에요. 관리자에게 문의하세요.",
    "auth/account-exists-with-different-credential":
      "같은 이메일이 다른 로그인 방식으로 이미 가입되어 있어요.",
    "auth/id-token-expired":
      "로그인 세션이 만료되었어요. 다시 로그인해 주세요.",
    "auth/id-token-revoked":
      "로그인 정보가 유효하지 않아요. 다시 로그인해 주세요.",
    "auth/unauthorized-continue-uri":
      "허용되지 않은 주소에서 로그인 시도를 하고 있어요.",
    "auth/claims-too-large": "요청 용량이 너무 커요.",
    "auth/insufficient-permission": "요청에 필요한 권한이 부족해요.",
    "auth/internal-error":
      "내부 서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
    "auth/invalid-argument": "요청이 잘못되었어요.",
    "auth/invalid-continue-uri": "리디렉션 주소가 잘못되었어요.",
    "auth/invalid-credential": "인증 정보가 유효하지 않아요.",
    "auth/invalid-display-name": "닉네임(이름)이 잘못되었어요.",
    "auth/invalid-password": "비밀번호가 6자 이상이어야 해요.",
    "auth/invalid-phone-number": "전화번호 형식이 올바르지 않아요.",
    "auth/invalid-photo-url": "프로필 사진 주소가 올바르지 않아요.",
    "auth/invalid-uid": "사용자 ID가 올바르지 않아요.",
    "auth/missing-continue-uri": "리디렉션 주소가 필요해요.",
    "auth/project-not-found":
      "Firebase 프로젝트를 찾을 수 없어요. 관리자에게 문의하세요.",
    "auth/session-cookie-expired":
      "로그인 세션이 만료되었어요. 다시 로그인해 주세요.",
    "auth/uid-already-exists": "이미 사용 중인 사용자 ID에요.",
    "auth/user-not-found": "사용자를 찾을 수 없어요.",
  };

  return (
    <div className="login-error-container">
      <div className="login-error-box">
        <WebName type={"login"} />
        <div className="login-error-box-two">
          <h3>Error</h3>
          <p className="login-error-middle">{firebaseAuthErrors[errorCode]}</p>
          <button
            className="login-error-arrow"
            onClick={() => setErrorCode("")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginError;
