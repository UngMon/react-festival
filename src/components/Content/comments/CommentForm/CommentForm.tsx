import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { originCommentActions } from "store/origin_comment-slice";
import { db } from "../../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { CommentType } from "type/DataType";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";
import "./CommentForm.css";

interface T {
  content_type: string;
  content_id: string;
}

const CommentForm = ({ content_type, content_id }: T) => {
  const dispatch = useAppDispatch();

  const { detailCommon } = useSelector((state: RootState) => state.content);

  const userData = useSelector((state: RootState) => state.firebase);
  const { current_user_name, current_user_id, current_user_photo, status } =
    userData;

  const [loading, setLoading] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCommon || !detailCommon[0].title)
      return alert("관광 데이터를 불러오지 못하여 댓글을 작성하실 수 없습니다.");

    if (current_user_id === "") return alert("비정상적인 접근입니다.");

    let text = textRef.current!.value;

    if (text.length === 0) return alert("글자를 입력해주세요!");

    const createdAt = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    const field_data: CommentType = {
      content_type,
      content_id,
      content_title: detailCommon[0].title || detailCommon[1].title,
      text,
      user_id: current_user_id,
      user_name: current_user_name,
      user_photo: current_user_photo,
      createdAt,
      origin_id: null,
      parent_id: null,
      parent_name: null,
      parent_user_id: null,
      like_count: 0,
      reply_count: 0,
      updatedAt: null,
      image_url: detailCommon[0].firstimage || detailCommon[0].firstimage2 || "",
      like_users: {},
    };

    const documentId = field_data.createdAt + field_data.user_id;

    const commentRef = doc(db, "comments", documentId);

    try {
      setLoading(true);
      await setDoc(commentRef, field_data);
      dispatch(originCommentActions.addNewComment({ field_data }));
    } catch (error: any) {
      alert(`리뷰 작성에 에러가 발생했습니다! ${error.message}`);
    } finally {
      setLoading(false);
    }
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
                {current_user_id === "" ? (
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

export default CommentForm;
