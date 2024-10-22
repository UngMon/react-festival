import React, { useRef } from "react";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Comment, UserData } from "../../../type/UserDataType";
import { convertText } from "../../../utils/convertText";

interface T {
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  contentTitle?: string;
  contentType: string;
  contentId: string;
  userData: UserData;
  dispatch: (value: { type: "pending" | "fulfiled" | "reject" }) => void;
}

const UserCommentForm = ({
  setComments,
  contentTitle,
  contentType,
  contentId,
  userData,
  dispatch,
}: T) => {
  console.log("UserCommentForm Component Render");
  const { userName, userUid, userPhoto, loginedUser } = userData;
  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle)
      return alert("데이터를 불러오지 못하여 댓글을 작성하실 수 없습니다.");
    if (!userUid) return alert("비정상적인 접근입니다.");

    let content = convertText(textRef.current!.value);

    if (content.length === 0) return alert("글자를 입력해주세요!");

    dispatch({ type: "pending" });

    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 9);

    const fieldData: Comment = {
      contentType,
      contentId,
      contentTitle,
      content,
      uid: userUid,
      name: userName,
      userPhoto: userPhoto,
      createdAt: timestamp.toISOString(),
      originUid: null,
      parentUid: null,
      parentName: null,
      like_count: 0,
      disLike_count: 0,
      reply_count: 0,
      isRevised: false,
      deepth: 0,
    };

    const documentId = fieldData.createdAt + fieldData.uid;

    const commentRef = doc(db, "comments", documentId);

    try {
      await setDoc(commentRef, fieldData);
      setComments((prevArray) => [{ ...fieldData, replies: [] }, ...prevArray]);
      dispatch({ type: "fulfiled" });
    } catch (error: any) {
      dispatch({ type: "reject" });
      alert(
        `리뷰 작성에 에러가 발생했습니다! ${error.message} 에러가 계속 발생한다면 문의해 주세요!`
      );
    }

    textRef.current!.value = "";
  };

  const resizeHandler = () => {
    textRef.current!.style.height = "auto"; // heigth 초기화
    textRef.current!.style.height = textRef.current?.scrollHeight + "px";
  };

  return (
    <form className="comment-input-box" onSubmit={reivewSubmitHandler}>
      <div className="comment-text-box">
        <label htmlFor="user-input" />
        <textarea
          id="user-input"
          name="user-input"
          rows={2}
          ref={textRef}
          onChange={resizeHandler}
          placeholder="소중한 리뷰를 작성해보세요!"
        />
        <i />
      </div>
      <div className="comment-button-box">
        {!loginedUser && userUid.length === 0 && (
          <button type="button">
            <Link to="/login">로그인</Link>
          </button>
        )}
        {loginedUser && userUid.length !== 0 && (
          <button type="submit">저장</button>
        )}
      </div>
    </form>
  );
};

export default UserCommentForm;
