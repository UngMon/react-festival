import React, { useRef } from "react";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { nowDate } from "../../../utils/NowDate";
import { serverTimestamp } from "firebase/firestore";
import { Comment, UserData } from "../../../type/UserDataType";
import { convertText } from "../../../utils/convertText";

interface T {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  collectionName: string;
  contentId: string;
  userData: UserData;
  dispatch: (value: { type: "pending" | "fulfiled" | "reject" }) => void;
}

const UserCommentForm = ({
  comments,
  setComments,
  collectionName,
  contentId,
  userData,
  dispatch,
}: T) => {
  const { userName, userUid, userPhoto, loginedUser } = userData;

  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userUid) return alert("비정상적인 접근입니다.");

    let text = convertText(textRef.current!.value);

    if (text.length === 0) return alert("글자를 입력해주세요!");

    dispatch({ type: "pending" });

    const { year, month, date, time } = nowDate();

    const fieldData: Comment = {
      name: userName,
      uid: userUid,
      when: year + "-" + month + "-" + date + "-" + time,
      text: `${text}`,
      userPhoto: userPhoto,
      createdAt: serverTimestamp(),
    };

    const documentId = fieldData.when + "=" + fieldData.uid;

    const commentRef = doc(
      db,
      collectionName,
      contentId,
      "comment",
      documentId
    );

    const array = [fieldData, ...comments];

    try {
      await setDoc(commentRef, fieldData);
      setComments(array);
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
