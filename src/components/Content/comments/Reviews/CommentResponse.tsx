import { Comment } from "../../../../type/DataType";
import { db } from "../../../../firebase";
import { useSelector } from "react-redux";
import { deleteField, doc, increment, writeBatch } from "firebase/firestore";
import { RootState, useAppDispatch } from "../../../../store/store";
import { originCommentActions } from "../../../../store/origin_comment-slice";
import { replyActions } from "../../../../store/reply-slice";
import { modalActions } from "../../../../store/modal-slice";
import { myReplyActions } from "../../../../store/my_reply-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faRegularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faSolidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "./CommentResponse.css";

interface T {
  type: string;
  origin_index: number;
  reply_index?: number;
  comment_data: Comment;
}

const CommentResponse = ({
  type,
  origin_index,
  reply_index,
  comment_data,
}: T) => {
  const dispatch = useAppDispatch();
  const { user_id, createdAt, origin_id, like_count } = comment_data;
  const currentUserId = useSelector((state: RootState) => state.firebase.user_id);

  const emotionOfRecord: boolean | undefined =
    comment_data.like_users[currentUserId];

  const feelClickHandler = async () => {
    if (!currentUserId) return alert("로그인 하시면 이용하실 수 있습니다.");

    // 댓글의 좋아요 카운트 변수 생성
    let like_count: number = emotionOfRecord ? -1 : 1;

    const time: string = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    if (type === "origin") {
      dispatch(
        originCommentActions.likeComment({
          origin_index,
          like_count,
          user_id: currentUserId,
        })
      );
    }

    if (origin_id && reply_index !== undefined) {
      if (type === "reply")
        dispatch(
          replyActions.likeComment({
            origin_id: origin_id!,
            reply_index: reply_index!,
            user_id: currentUserId,
            like_count,
          })
        );

      if (type === "my") {
        dispatch(
          myReplyActions.likeComment({
            origin_id,
            comment_id: createdAt + user_id,
            user_id: currentUserId,
            like_count,
          })
        );
      }
    }

    try {
      // Firestore 문서 업데이트
      const batch = writeBatch(db);
      const documentId = createdAt + user_id;

      const docRef = doc(db, "comments", documentId);
      const userRef = doc(
        db,
        "userData",
        currentUserId,
        "liked_comments",
        documentId
      );

      batch.update(docRef, {
        like_count: increment(like_count),
        [`like_users.${currentUserId}`]: emotionOfRecord ? deleteField() : true,
      });

      if (!emotionOfRecord) {
        batch.set(userRef, {
          origin_id,
          comment_id: createdAt + user_id,
          createdAt: time,
          content_title: comment_data.content_title,
          content_id: comment_data.content_id,
          content_type: comment_data.content_type,
          image_url: comment_data.image_url,
          text: comment_data.text,
          user_id: currentUserId,
        });
      } else batch.delete(userRef);

      await batch.commit();
    } catch (error: any) {
      console.error(error);
      alert("문제가 발생했습니다!");
    }
  };

  const replyHandler = () => {
    if (!currentUserId) return alert("로그인 하시면 이용하실 수 있습니다.");
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
