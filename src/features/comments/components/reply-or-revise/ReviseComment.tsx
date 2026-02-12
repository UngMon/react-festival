import { CommentType } from "types/DataType";
import { useRef, useState } from "react";
import { useCommentSubmit } from "features/comments/hook/useCommentSubmit";
import ReplyOrRevise from "./ReplyOrRevise";

interface T {
  type: string;
  depth: number;
  comment_data: CommentType;
}

const ReviseComment = ({ type, depth, comment_data }: T) => {
  const { createdAt, user_id, text } = comment_data;
  const comment_id = createdAt + user_id;

  const divRef = useRef<HTMLDivElement>(null);
  const { loading, handleRevise } = useCommentSubmit(type, comment_data);
  const [submitPossible, setSubmitPossible] = useState<boolean>(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!divRef.current) return alert("댓글이 존재하지 않습니다.");
    const currentText = divRef.current.innerText || "";
    handleRevise(currentText); // 훅 함수 호출
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

    if (innerText === text) {
      setSubmitPossible(false);
      return;
    }

    setSubmitPossible(true);
  };

  return (
    <ReplyOrRevise
      type="revise"
      loading={loading}
      depth={depth}
      submitPossible={submitPossible}
      handleInput={handleInput}
      onSubmit={onSubmit}
      comment_id={comment_id}
      divRef={divRef}
      text={text}
    />
  );
};

export default ReviseComment;
