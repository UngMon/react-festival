import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  redirectGoogleAndFacebook,
  redirectKakaoLogin,
  redirectNaverLogin,
  executeWithdrawal,
  isAuthFresh,
} from "utils/login_utils";
import { useAppDispatch } from "store/store";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./DeleteAccount.css";

interface T {
  setOpenDeleteAcc: (value: boolean) => void;
  provider: string | null;
  logout: () => Promise<void>;
}

const DeleteAccount = ({ setOpenDeleteAcc, provider, logout }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 보안을 위해 사용자가 로그인 후 1시간 이내에 회원 탈퇴를 한 경우, 데이터 삭제
    // 그렇지 않고 1시간 이후는 계정 재인증 후에 데이터 삭제

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1. 탈퇴 대기 중인지 확인
      const isPending = sessionStorage.getItem("pendingWithdrawal");
      if (!isPending) return;

      if (user) {
        try {
          setLoading(true);
          // 2. 대기 중이라면 즉시 탈퇴 로직 실행
          await executeWithdrawal();
          await logout();
          sessionStorage.removeItem("pendingWithdrawal");
          setOpenDeleteAcc(false);
          navigate("/", { replace: true });
        } catch (error: any) {
          console.error("탈퇴 처리 중 오류 발생:", error);

          if (error.code === "auth/requires-recent-login") {
            alert("보안을 위해 다시 로그인 후 탈퇴를 진행해 주세요.");
          } else {
            alert(
              "탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            );
          }
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, setOpenDeleteAcc, logout]);

  const initiateWithdrawal = async () => {
    const userData = auth.currentUser;

    try {
      if (!userData) {
        throw new Error("사용자 정보가 없습니다!");
      }

      if (!provider) throw new Error("제공하지 않는 인증입니다.");

      // 1. 사용자 로그인 후, 5분 이내
      const fresh = await isAuthFresh();

      if (fresh) {
        await executeWithdrawal();
        await logout();
        setOpenDeleteAcc(false);
        navigate("/", { replace: true });
      } else {
        // 로그인 후, 5분이 지났다면 재인증을 하고 다시 리디렉션을 대비해서 세션스토리지에 key, value 저장
        sessionStorage.setItem("previousUrl", "user");
        alert("보안을 위해 다시 한 번 로그인을 진행합니다.");

        if (provider === "kakao.com") {
          redirectKakaoLogin();
        } else if (provider === "naver.com") {
          redirectNaverLogin();
        } else if (provider === "google.com" || provider === "facebook.com") {
          await redirectGoogleAndFacebook(provider);
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(`${error.message}`);
    }
  };

  return (
    <div className="del-acc-container">
      <div id="delete-icon">
        <span className="material-symbols-outlined">delete</span>
      </div>
      <h2>회원 탈퇴</h2>
      <b>💡 탈퇴 전 꼭 확인해 주세요!</b>
      <ul>
        <li>
          <span>
            사용자가 작성하신 게시글, 댓글, 좋아요 및 프로필 정보가 즉시
            삭제됩니다.
          </span>
        </li>
        <li>
          계정 복구 유예 기간이 없으며, 삭제된 데이터는 복구가 불가능합니다.
        </li>
      </ul>
      <div className="del-acc-but-box">
        <button
          type="button"
          className="del-acc-close"
          onClick={() => setOpenDeleteAcc(false)}
        >
          취소
        </button>
        <button type="button" onClick={initiateWithdrawal}>
          회원 탈퇴
        </button>
      </div>
      {loading && <LoadingSpinnerTwo width="50px" padding="10px" />}
    </div>
  );
};

export default DeleteAccount;
