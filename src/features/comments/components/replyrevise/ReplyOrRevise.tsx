import { CommentType } from "types/DataType";
import { useAuth } from "context/AuthContext";
import { useCommentSubmit } from "features/comments/hook/useCommentSubmit";
import { useEffect, useRef, useState } from "react";
import { modalActions } from "store/modal-slice";
import { useAppDispatch } from "store/store";
import UserIcon from "../comment/UserIcon";
import LoadingSpinnerTwo from "common/loading/LoadingSpinnerTwo";
import "./ReplyOrRevise.css";

interface Props {
  role: string;
  mode: string;
  depth: number;
  comment_data: CommentType;
}

const ReplyOrRevise = ({ role, mode, depth, comment_data }: Props) => {
  const { createdAt, user_id, text } = comment_data;
  const comment_id = createdAt + user_id;

  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const [submitPossible, setSubmitPossible] = useState<boolean>(false);
  const { loading, action } = useCommentSubmit(role, mode, comment_data);

  const handleCancel = () => {
    dispatch(modalActions.toggleToastModal({ comment_id, mode }));
  };

  useEffect(() => {
    if (divRef.current && mode === "revise" && text) {
      divRef.current.innerText = text;
      divRef.current.focus();

      // 커서를 맨 뒤로 이동시키는 로직 추가
      const range = document.createRange();
      const selection = window.getSelection();

      if (selection) {
        range.selectNodeContents(divRef.current); // divRef 내부의 컨텐츠를 선택 영역으로 지정
        range.collapse(false); // false를 전달하여 선택 영역을 끝점(맨 뒤)으로 축소 (커서 이동)
        selection.removeAllRanges(); // 기존의 모든 선택 영역을 제거
        selection.addRange(range); // 맨 뒤로 설정된 새로운 범위를 선택 영역으로 추가
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!divRef.current) return alert("댓글이 존재하지 않습니다.");
    const currentText = divRef.current.innerText || "";
    await action(currentText); // 훅 함수 호출
    handleCancel();
  };

  const handleInput = (e: React.FormEvent) => {
    const target = e.target as HTMLDivElement;
    if (!target) return;

    const innerText = target.innerText;
    const len = innerText.length;

    if (len === 0) {
      setSubmitPossible(false);
      return;
    }

    if (len === 1) {
      setSubmitPossible(innerText.trim().length === 1);
      return;
    }

    if (mode === "revise" && innerText === text) {
      setSubmitPossible(false);
      return;
    }

    setSubmitPossible(true);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      ) : (
        <div
          className="comment-container"
          style={{
            marginLeft: `${depth * 55}px`,
          }}
        >
          <UserIcon user_photo={user?.photoURL} user_name={user?.displayName} />
          <form className="reply-input-box" onSubmit={(e) => onSubmit(e)}>
            <div className="reply-text-box">
              <div
                ref={divRef}
                className="editable"
                contentEditable="true"
                spellCheck="false"
                dir="auto"
                onInput={(e) => handleInput(e)}
              ></div>
              <i />
            </div>
            <div className="reply-button-box">
              <button className="enabled" type="button" onClick={handleCancel}>
                취소
              </button>
              <button
                className={submitPossible ? "enabled" : "disabled"}
                type="submit"
                disabled={!submitPossible}
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ReplyOrRevise;
