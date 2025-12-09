import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store/store";
import { originCommentActions } from "store/origin_comment-slice";
import { CommentType } from "type/DataType";
import { submitCommentToFirestore } from "api/firestoreUtils";
import { Link } from "react-router-dom";
import LoadingSpinnerTwo from "components/Loading/LoadingSpinnerTwo";
import "./CommentForm.css";

interface T {
  content_type: string;
  content_id: string;
}

const CommentForm = ({ content_type, content_id }: T) => {
  const dispatch = useAppDispatch();

  const userData = useSelector((state: RootState) => state.firebase);
  const { detailCommon } = useSelector((state: RootState) => state.content);
  const { current_user_id, status } = userData;

  const [loading, setLoading] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const reivewSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (current_user_id === "")
      return alert("로그인 하시면 이용하실 수 있습니다.");

    if (!detailCommon?.[0]?.title)
      return alert(
        "관광 데이터를 불러오지 못하여 댓글을 작성하실 수 없습니다."
      );

    // textRef.current가 있는지 먼저 확인
    if (!textRef.current) return;

    let text = textRef.current!.value;

    if (text.length === 0) return alert("글자를 입력해주세요!");

    try {
      setLoading(true);
      const field_data: CommentType = await submitCommentToFirestore(
        content_type,
        content_id,
        userData,
        detailCommon,
        text
      );

      dispatch(originCommentActions.addNewComment({ field_data }));
    } catch (error: any) {
      alert("오류가 발생했습니다.");
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
