import { CommentType } from "types/DataType";
import { useRef, useState } from "react";
import { useCommentSubmit } from "features/comments/hook/useCommentSubmit";
import ReplyOrRevise from "./ReplyOrRevise";
import "./ReplyOrReviseComment.css";

interface T {
  depth: number;
  comment_data: CommentType;
}

const ReplyComment = ({ depth, comment_data }: T) => {
  const { createdAt, user_id } = comment_data;
  const comment_id = createdAt + user_id;

  const divRef = useRef<HTMLDivElement>(null);
  const { loading, handleReply } = useCommentSubmit("reply", comment_data);
  const [submitPossible, setSubmitPossible] = useState<boolean>(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!divRef.current) return alert("댓글이 존재하지 않습니다.");
    const currentText = divRef.current.innerText || "";
    handleReply(currentText); // 훅 함수 호출
  };

  const handleInput = (e: React.FormEvent) => {
    const target = e.target as HTMLDivElement;
    if (!target) return;

    const innerText = target.innerText;
    const len = innerText.length;
    // 길이가 0 이면 저장 버튼 비활성화
    if (len === 0) {
      setSubmitPossible(false);
      return;
    }
    // 길이가 1일 때만 trim() 검사 (불필요한 호출 최소화)
    if (len === 1) {
      setSubmitPossible(innerText.trim().length === 1);
      return;
    }
    // 길이가 2 이상이면 무조건 true
    setSubmitPossible(true);
  };

  return (
    <ReplyOrRevise
      type="reply"
      loading={loading}
      depth={depth}
      submitPossible={submitPossible}
      handleInput={handleInput}
      onSubmit={onSubmit}
      comment_id={comment_id}
      divRef={divRef}
    />
  );
};

export default ReplyComment;
