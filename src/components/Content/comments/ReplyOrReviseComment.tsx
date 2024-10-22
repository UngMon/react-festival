import React, { useRef, useState } from "react";
import { Comment, PickComment, UserData } from "../../../type/UserDataType";
import { doc, increment, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";
import UserIcon from "./UserIcon";
import "./ReplyOrReviseComment.css";

interface T {
  originIndex?: number;
  index: number;
  originData: Comment;
  replyData?: Comment;
  userData: UserData;
  isRevise: boolean;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
}

const ReplyOrReviseComment = ({
  originIndex,
  index,
  originData,
  replyData,
  userData,
  isRevise,
  setComments,
  setPickedComment,
  setReplyComments,
}: T) => {
  const textRef = useRef<HTMLTextAreaElement>(null);

  // ***********************
  // 1. 수정 : 오리지널 수정, 대댓글 수정 => isRevise = true
  // 2. 답글 : 오리지널에 답글, 대댓글에 답글 => isRevise = false
  const commentData: Comment = replyData ?? originData;
  const [text, setText] = useState<string>(isRevise ? commentData.content : "");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = textRef.current?.value;

    if (!content) return alert("댓글을 입력해주세요!");

    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 9);

    const key = commentData.createdAt + commentData.uid;
    const createdAt = isRevise
      ? commentData.createdAt
      : timestamp.toISOString();

    const newReplyDoucmentRef = doc(
      db,
      "comments",
      createdAt + commentData.uid
    );

    try {
      if (isRevise) {
        await updateDoc(newReplyDoucmentRef, { content, isRevised: true });
        const updateComment: Comment = JSON.parse(JSON.stringify(commentData));
        updateComment.content = content;

        if (replyData) {
          setReplyComments((prevReplys) => ({
            ...prevReplys,
            [commentData.createdAt + commentData.uid]: [
              ...prevReplys[key].slice(0, index),
              updateComment,
              ...prevReplys[key].slice(index + 1),
            ],
          }));
        } else {
          setComments((prevComments) => [
            ...prevComments.slice(0, index),
            updateComment,
            ...prevComments.slice(index + 1),
          ]);
        }
      } else {
        const batch = writeBatch(db);

        const originDocumentRef = doc(
          db,
          "comments",
          originData.createdAt + originData.uid
        );

        const fieldData: Comment = {
          contentType: commentData.contentType,
          contentId: commentData.contentId,
          contentTitle: commentData.contentTitle,
          content,
          uid: userData.userUid,
          name: userData.userName,
          userPhoto: userData.userPhoto,
          createdAt,
          originUid: commentData.uid,
          parentUid: commentData.uid,
          parentName: commentData.name,
          like_count: 0,
          disLike_count: 0,
          reply_count: 0,
          isRevised: false,
          deepth: commentData.deepth + 1,
        };

        batch.set(newReplyDoucmentRef, fieldData);
        batch.update(originDocumentRef, { reply_count: increment(1) });
        batch.commit();

        setReplyComments((prevReplys) => {
          const replyDatas = prevReplys[key] ?? [];

          return {
            ...prevReplys,
            [commentData.createdAt + commentData.uid]: [
              ...replyDatas,
              fieldData,
            ],
          };
        });

        setComments((prevComments) => {
          const copyOriginData: Comment = JSON.parse(
            JSON.stringify(prevComments[originIndex!])
          );

          copyOriginData.reply_count += 1;

          return [
            ...prevComments.slice(0, originIndex!),
            copyOriginData,
            ...prevComments.slice(originIndex! + 1),
          ];
        });
      }
      setPickedComment((prevState) => {
        const {
          [`${commentData.createdAt}${commentData.uid}`]: removed,
          ...rest
        } = prevState;
        return { ...rest } as PickComment;
      });
    } catch (error: any) {
      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <div
      className="comment-container"
      style={{
        marginLeft: isRevise ? "" : "65px",
        width: isRevise ? "" : "calc(100% - 100px)",
      }}
    >
      <UserIcon userPhoto={userData.userPhoto} userName={userData.userName} />
      <form className="reply-input-box" onSubmit={submitHandler}>
        <div className="reply-text-box">
          <textarea
            id="reply-input"
            name="user-input"
            rows={text.split("\n").length}
            ref={textRef}
            style={{ minHeight: "25px" }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setText(e.target.value);
              textRef.current!.style.height = "auto";
              textRef.current!.style.height =
                textRef.current?.scrollHeight + "px";
            }}
            value={text}
            placeholder={text.length === 0 ? "댓글 추가" : ""}
          />
          <i />
        </div>
        <div className="reply-button-box">
          <button
            type="button"
            onClick={() => {
              setPickedComment((prevState) => {
                const {
                  [`${commentData.createdAt}${commentData.uid}`]: removed,
                  ...rest
                } = prevState;
                return { ...rest } as PickComment;
              });
            }}
          >
            취소
          </button>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
};

export default ReplyOrReviseComment;
