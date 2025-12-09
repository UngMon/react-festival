import { useSelector } from "react-redux";
import { CommentType } from "../../../../type/DataType";
import { RootState, useAppDispatch } from "../../../../store/store";
import { originCommentActions } from "../../../../store/origin_comment-slice";
import { replyActions } from "../../../../store/reply-slice";
import { modalActions } from "../../../../store/modal-slice";
import { myReplyActions } from "../../../../store/my_reply-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faRegularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faSolidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { likeButtonOfComment } from "api/firestoreUtils";
import "./CommentResponse.css";

interface T {
  type: string;
  comment_data: CommentType;
}

const CommentResponse = ({ type, comment_data }: T) => {
  const dispatch = useAppDispatch();
  const { user_id, createdAt, origin_id, like_count } = comment_data;
  const current_user_id = useSelector(
    (state: RootState) => state.firebase.current_user_id
  );

  const emotionOfRecord: boolean | undefined =
    comment_data.like_users[current_user_id];

  const feelClickHandler = async () => {
    if (!current_user_id) return alert("로그인 하시면 이용하실 수 있습니다.");

    // 댓글의 좋아요 카운트 변수 생성
    let like_count: number = emotionOfRecord ? -1 : 1;

    if (type === "origin")
      dispatch(
        originCommentActions.likeComment({
          comment_id: createdAt + user_id,
          like_count,
          user_id: current_user_id,
        })
      );
    else if (type === "reply")
      dispatch(
        replyActions.likeComment({
          origin_id: origin_id!,
          reply_id: createdAt + user_id,
          user_id: current_user_id,
          like_count,
        })
      );
    else if (type === "my")
      dispatch(
        myReplyActions.likeComment({
          origin_id: origin_id!,
          comment_id: createdAt + user_id,
          user_id: current_user_id,
          like_count,
        })
      );

    try {
      await likeButtonOfComment(
        like_count,
        current_user_id,
        comment_data,
        emotionOfRecord
      );
    } catch (error: any) {
      alert("문제가 발생했습니다!");
    }
  };

  const replyHandler = () => {
    if (!current_user_id) return alert("로그인 하시면 이용하실 수 있습니다.");
    dispatch(
      modalActions.clickReplyButton({ comment_id: createdAt + user_id })
    );
  };

  return (
    <div className="submenu">
      <div className={emotionOfRecord ? "sub-box press-like" : "sub-box"}>
        <button onClick={feelClickHandler} type="button">
          <FontAwesomeIcon
            icon={emotionOfRecord ? faSolidThumbsUp : faRegularThumbsUp}
          />
        </button>
        <span>{like_count}</span>
      </div>
      <div className="sub-box">
        <button type="button" onClick={replyHandler}>
          <span style={{ fontWeight: "600" }}>답글</span>
        </button>
      </div>
    </div>
  );
};

export default CommentResponse;
