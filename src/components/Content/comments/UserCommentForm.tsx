import { useRef, useState } from "react";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Comment } from "../../../type/UserDataType";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";
import "./UserCommentForm.css";

interface T {
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  content_type: string;
  content_id: string;
}

const UserCommentForm = ({ setComments, content_type, content_id }: T) => {
  console.log("UserCommentForm Component Render");

  const contentTitle = useSelector(
    (state: RootState) => state.data.contentTitle
  );

  const userData = useSelector((state: RootState) => state.firebase);
  const { user_id, user_name, user_photo, loginedUser, loadingState } =
    userData;

  const [loading, setLoading] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!contentTitle)
    //   return alert("데이터를 불러오지 못하여 댓글을 작성하실 수 없습니다.");

    if (user_id === "") return alert("비정상적인 접근입니다.");

    let content = textRef.current!.value;

    if (content.length === 0) return alert("글자를 입력해주세요!");

    setLoading(true);

    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() + 9);

    const fieldData: Comment = {
      content_type,
      content_id,
      content_title: "",
      content: [content, '', ''],
      user_id,
      user_name,
      user_photo,
      createdAt: timestamp.toISOString(),
      origin_id: null,
      parent_id: null,
      parent_name: null,
      like_count: 0,
      dislike_count: 0,
      reply_count: 0,
      isRevised: false,
      emotion: {},
    };

    const documentId = fieldData.createdAt + fieldData.user_id;

    const commentRef = doc(db, "comments", documentId);

    try {
      await setDoc(commentRef, fieldData);
      setComments((prevArray) => [{ ...fieldData, replies: [] }, ...prevArray]);
    } catch (error: any) {
      alert(
        `리뷰 작성에 에러가 발생했습니다! ${error.message} 에러가 계속 발생한다면 문의해 주세요!`
      );
    }

    setLoading(false);
  };

  const resizeHandler = () => {
    textRef.current!.style.height = "auto"; // heigth 초기화
    textRef.current!.style.height = textRef.current?.scrollHeight + "px";
  };

  return (
    <>
      {!loading ? (
        <form className="comment-form-box" onSubmit={reivewSubmitHandler}>
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
            {loadingState === "fulfilled" && (
              <>
                {!loginedUser ? (
                  <button type="button">
                    <Link to="/login">로그인</Link>
                  </button>
                ) : (
                  <button type="submit">저장</button>
                )}
              </>
            )}
          </div>
        </form>
      ) : (
        <div style={{ margin: "116.5px 0" }}>
          <LoadingSpinnerTwo width="25px" padding="8px" />
        </div>
      )}
    </>
  );
};

export default UserCommentForm;
