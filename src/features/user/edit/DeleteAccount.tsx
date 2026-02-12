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
import { firebaseActions } from "store/firebase-slice";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./DeleteAccount.css";

interface T {
  setOpenDeleteAcc: (value: boolean) => void;
}

const DeleteAccount = ({ setOpenDeleteAcc }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 보안을 위해 사용자가 로그인 후 시간이 5분 이내에 회원 탈퇴를 한 경우, 데이터 삭제
    // 그렇지 않고 5분이 지난 후라면 재인증 이후 계정 데이터 삭제

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1. 탈퇴 대기 중인지 확인
      const isPending = sessionStorage.getItem("pendingWithdrawal");
      if (!isPending) return;

      if (user) {
        try {
          setLoading(true);
          // 2. 대기 중이라면 즉시 탈퇴 로직 실행
          await executeWithdrawal();
          sessionStorage.removeItem("pendingWithdrawal");
          setOpenDeleteAcc(false);
          dispatch(firebaseActions.logout()); // 사용자 정보 redux 초기화
          navigate("/", { replace: true });
        } catch (error: any) {
          console.error("탈퇴 처리 중 오류 발생:", error);

          if (error.code === "auth/requires-recent-login") {
            alert("보안을 위해 다시 로그인한 후 탈퇴를 진행해 주세요.");
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
  }, [dispatch, navigate, setOpenDeleteAcc]);

  const initiateWithdrawal = async () => {
    const userData = auth.currentUser;

    try {
      if (!userData) {
        throw new Error("사용자 정보가 없습니다!");
      }

      let provider: string | null = userData.providerData[0]?.providerId;

      if (!provider) {
        // 인증업체 식별
        if (userData.email?.includes("kakao")) provider = "kakao.com";
        else if (userData.email?.includes("naver")) provider = "naver.com";
        else provider = null;
      }

      if (!provider) throw new Error("제공하지 않는 인증입니다.");

      // 1. 사용자 로그인 후, 5분 이내
      const fresh = await isAuthFresh();

      if (fresh) {
        await executeWithdrawal();
        alert("회원님의 계정을 삭제했습니다.");
        setOpenDeleteAcc(false);
        navigate("/", { replace: true });
      } else {
        // 로그인 후, 5분이 지났다면 재인증을 하고 다시 리디렉션을 대비해서 세션스토리지에 key, value 저장
        sessionStorage.setItem("pendingWithdrawal", "true");
        alert("보안을 위해 다시 한번 로그인 해주세요.");

        if (provider === "kakao.com") {
          redirectKakaoLogin();
        } else if (provider === "naver.com") {
          redirectNaverLogin();
        } else if (provider === "google.com" || provider === "facebook.com") {
          await redirectGoogleAndFacebook(provider);
        }
      }
    } catch (error: any) {
      console.error("탈퇴 프로세스 에러:", error);
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
      <p>회원 탈퇴를 진행하시겠습니까?</p>
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
