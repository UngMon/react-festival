import { CommentType } from "type/DataType";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { useEffect, useRef, useState } from "react";
import { modalActions } from "store/modal-slice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { originCommentActions } from "store/origin_comment-slice";
import { replyActions } from "store/reply-slice";
import { myReplyActions } from "store/my_reply-slice";
import UserIcon from "./UserIcon";

interface T {
  type: string;
  deepth: number;
  comment_data: CommentType;
}

const ReviseComment = ({ type, deepth, comment_data }: T) => {
  const { origin_id, createdAt, user_id, text } = comment_data;
  const comment_id = createdAt + user_id;

  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const [submitPossible, setSubmitPossible] = useState<boolean>(false);
  const { current_user_photo, current_user_name } = useSelector(
    (state: RootState) => state.firebase
  );

  useEffect(() => {
    if (divRef.current) divRef.current.innerText = text;
  }, [text]);

  const submitRevisedDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!divRef.current) {
      return alert("댓글이 존재하지 않습니다.");
    }

    const revisedText = divRef.current.innerText;

    if (revisedText.length === 0) return alert("댓글을 작성해주세요!");

    const reviseDocRef = doc(db, "comments", comment_id);
    const updatedAt: string = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    try {
      await updateDoc(reviseDocRef, { text: revisedText, updatedAt });

      if (type === "origin") {
        dispatch(
          originCommentActions.reviseComment({
            comment_id,
            text: revisedText,
            updatedAt,
          })
        );
      }

      if (type === "reply") {
        dispatch(
          replyActions.reviseComment({
            origin_id: origin_id!,
            reply_id: comment_id,
            text: revisedText,
            updatedAt,
          })
        );
      }

      if (type === "my") {
        dispatch(
          myReplyActions.reviseComment({
            origin_id: origin_id!,
            comment_id,
            text: revisedText,
            updatedAt,
          })
        );
      }

      dispatch(modalActions.clearModalInfo({ comment_id, type: "revise" }));
    } catch (error) {
      console.log(error);
    }
  };

  const inputHandler = (e: React.FormEvent<HTMLDivElement>) => {
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

    if (!submitPossible) setSubmitPossible(true);
  };

  return (
    <div
      className="comment-container"
      style={{
        marginLeft: `${deepth * 55}px`,
      }}
    >
      <UserIcon user_photo={current_user_photo} user_name={current_user_name} />
      <form
        className="reply-input-box"
        onSubmit={(e) => submitRevisedDocument(e)}
      >
        <div className="reply-text-box">
          <div
            ref={divRef}
            className="editable"
            contentEditable="true"
            spellCheck="false"
            dir="auto"
            onInput={(e) => inputHandler(e)}
          ></div>
          <i />
        </div>
        <div className="reply-button-box">
          <button
            className="enabled"
            type="button"
            onClick={() => {
              dispatch(
                modalActions.clearModalInfo({ comment_id, type: "revise" })
              );
            }}
          >
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
  );
};

export default ReviseComment;
