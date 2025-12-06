import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { modalActions } from "store/modal-slice";
import { RootState, useAppDispatch } from "store/store";
import "./FeedbackToast.css";

const progressState = [
  "댓글을 삭제 중입니다.",
  "댓글을 신고 중입니다.",
  "데이터를 삭제 중입니다.",
];
const doneStates = [
  "댓글을 삭제했습니다.",
  "댓글을 신고 했습니다.",
  "데이터를 삭제했습니다.",
  "오류가 발생했습니다.",
];

const FeedbackToast = () => {
  const dispatch = useAppDispatch();
  const api_state = useSelector((state: RootState) => state.modal.api_state);

  // 상태 파생 변수
  const inProgress = progressState.includes(api_state);
  const isDone = doneStates.includes(api_state);

  // 애니메이션 종료(내려가기)를 제어하기 위한 로컬 상태
  const [isClosing, setIsClosing] = useState(false);

  // 보여주기 조건: 진행 중이거나 완료 상태이면서, 아직 닫는 중이 아닐 때
  // isDone일 때 isClosing이 true가 되면 클래스가 빠지면서 내려가는 효과 발생
  const isVisible = inProgress || (isDone && !isClosing);

  useEffect(() => {
    let closeTimer: NodeJS.Timeout;
    let resetTimer: NodeJS.Timeout;

    if (isDone) {
      // 1. 1초 뒤에 '내려가는' 애니메이션 시작 (클래스 제거를 위해 상태 변경)
      closeTimer = setTimeout(() => {
        setIsClosing(true);
      }, 1000);

      // 2. 2초 뒤에 실제 Redux 상태 초기화 및 로컬 상태 복구
      resetTimer = setTimeout(() => {
        dispatch(modalActions.toggleToastModal({}));
        setIsClosing(false); // 다음 토스트를 위해 초기화
      }, 2000);
    }

    // 클린업: 컴포넌트가 사라지거나 api_state가 급격히 변할 때 타이머 취소
    return () => {
      clearTimeout(closeTimer);
      clearTimeout(resetTimer);
    };
  }, [isDone, dispatch]);

  return (
    <div
      className={`feedback-toast ${isVisible ? "active" : ""}`}
      role="alert"
      aria-live="assertive"
    >
      <p>{api_state}</p>
    </div>
  );
};

export default FeedbackToast;
