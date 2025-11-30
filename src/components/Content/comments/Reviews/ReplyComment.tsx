import { CommentType } from "type/DataType";
import { db } from "../../../../firebase";
import { doc, increment, writeBatch } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { useRef, useState } from "react";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import UserIcon from "./UserIcon";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";
import "./ReplyOrReviseComment.css";

interface T {
  deepth: number;
  comment_data: CommentType;
}

const ReplyComment = ({ deepth, comment_data }: T) => {
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);

  const { current_user_id, current_user_photo, current_user_name } =
    useSelector((state: RootState) => state.firebase);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitPossible, setSubmitPossible] = useState<boolean>(false);

  const { createdAt, user_id, origin_id, user_name } = comment_data;
  const comment_id = createdAt + user_id;

  const replyHandler = async (text: string) => {
    const timestamp: string = new Date(
      Date.now() + 9 * 60 * 60 * 1000
    ).toISOString();

    const batch = writeBatch(db);

    const isReplyToReply = origin_id ? true : false;

    const originId = origin_id || comment_id;
    const document_id = timestamp + current_user_id;

    const fieldData: CommentType = {
      content_type: comment_data.content_type,
      content_id: comment_data.content_id,
      content_title: comment_data.content_title,
      text,
      user_id: current_user_id,
      user_name: current_user_name,
      user_photo: current_user_photo,
      createdAt: timestamp,
      origin_id: originId,
      parent_id: isReplyToReply ? comment_id : null,
      parent_name: isReplyToReply ? user_name : null,
      parent_user_id: origin_id ? user_id : null,
      like_count: 0,
      reply_count: 0,
      updatedAt: null,
      image_url: comment_data.image_url,
      like_users: {},
    };

    try {
      const replyDocRef = doc(db, "comments", document_id);
      const originDocumentRef = doc(db, "comments", originId);
      batch.set(replyDocRef, fieldData);
      batch.update(originDocumentRef, { reply_count: increment(1) });
      await batch.commit();

      dispatch(
        myReplyActions.addNewMyReply({
          origin_id: originId,
          comment_id: document_id,
          comment_data: fieldData,
        })
      );

      dispatch(modalActions.clearModalInfo({ comment_id, type: "reply" }));
    } catch (error: any) {
      alert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current_user_id) return alert("로그인 하시면 이용하실 수 있습니다.");

    const text = divRef.current?.innerText.trim();
    if (!text) return alert("댓글을 작성해주세요!");

    try {
      setLoading(true);
      await replyHandler(text);
    } catch (error: any) {
      alert("답글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinnerTwo width="20px" padding="7px" />
      ) : (
        <div
          className="comment-container"
          style={{
            marginLeft: `${deepth * 55}px`,
          }}
        >
          <UserIcon
            user_photo={current_user_photo}
            user_name={current_user_name}
          />
          <form className="reply-input-box" onSubmit={submitHandler}>
            <div className="reply-text-box">
              <div
                ref={divRef}
                className="editable"
                contentEditable="true"
                spellCheck="false"
                dir="auto"
                onInput={(e) => {
                  const target = e.target as HTMLDivElement;
                  const text = target.innerText;
                  const len = text.length;
                  // 길이가 0 이면 저장 버튼 비활성화
                  if (len === 0) {
                    setSubmitPossible(false);
                    return;
                  }
                  // 길이가 1일 때만 trim() 검사 (불필요한 호출 최소화)
                  if (len === 1) {
                    setSubmitPossible(text.trim().length === 1);
                    return;
                  }
                  // 길이가 2 이상이면 무조건 true
                  setSubmitPossible(true);
                }}
              ></div>
              <i />
            </div>
            <div className="reply-button-box">
              <button
                className="enabled"
                type="button"
                onClick={() => {
                  dispatch(
                    modalActions.clearModalInfo({ comment_id, type: "reply" })
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
      )}
    </>
  );
};

export default ReplyComment;
