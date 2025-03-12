import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../redux/store";
import { originCommentActions } from "../../../redux/origin_comment-slice";
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Comment } from "../../../type/DataType";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";
import "./UserCommentForm.css";

interface T {
  content_type: string;
  content_id: string;
}

const UserCommentForm = ({ content_type, content_id }: T) => {
  console.log("UserCommentForm Component Render");
  const dispatch = useAppDispatch();

  const { detailCommon } = useSelector((state: RootState) => state.content);

  const userData = useSelector((state: RootState) => state.firebase);
  const { user_id, user_name, user_photo, status } = userData;

  const [loading, setLoading] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCommon || !detailCommon[0].title)
      return alert("데이터를 불러오지 못하여 댓글을 작성하실 수 없습니다.");

    if (user_id === "") return alert("비정상적인 접근입니다.");

    let content = textRef.current!.value;

    if (content.length === 0) return alert("글자를 입력해주세요!");

    setLoading(true);

    const createdAt = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    const field_data: Comment = {
      content_type,
      content_id,
      content_title: detailCommon[0].title || detailCommon[1].title,
      content: [content, "", ""],
      user_id,
      user_name,
      user_photo,
      createdAt,
      origin_id: null,
      parent_id: null,
      parent_name: null,
      like_count: 0,
      reply_count: 0,
      isRevised: false,
      image_url:
        detailCommon[0].firstimage || detailCommon[0].firstimage2 || "",
      like_users: [],
    };

    const documentId = field_data.createdAt + field_data.user_id;

    const commentRef = doc(db, "comments", documentId);

    try {
      await setDoc(commentRef, field_data);
      dispatch(originCommentActions.addNewComment({ field_data }));
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
            {status === "fulfilled" && (
              <>
                {user_id === "" ? (
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
