import { UserData } from "../../../../type/UserDataType";
import { Comment } from "../../../../type/DataType";
import { db } from "../../../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  FieldValue,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useAppDispatch } from "../../../../store/store";
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
  userData: UserData;
}

const CommentResponse = ({
  type,
  origin_index,
  reply_index,
  comment_data,
  userData,
}: T) => {
  const dispatch = useAppDispatch();
  const { user_id, createdAt, origin_id, like_count } = comment_data;

  const emotionOfRecord = comment_data.like_users.indexOf(userData.user_id);
  const feelClickHandler = async () => {
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");

    // 댓글의 좋아요 카운트 변수 생성
    let like_count: number = 0;
    let like_users: FieldValue;

    // 댓글에 좋아요 기록이 있는지에 관한 변수 생성
    const prevEmotion: number = comment_data.like_users.indexOf(
      userData.user_id
    );
    const time: string = new Date(
      new Date().getTime() + 9 * 60 * 60 * 1000
    ).toISOString();

    if (prevEmotion === -1) {
      // 사용자가 이 댓글에 좋아요 버튼을 누른 기록이 없는 경우 추가하기,
      like_count = 1;
      like_users = arrayUnion(userData.user_id);
    } else {
      // 같은 감정 표현 아이콘을 클릭하면 삭제 (초기화)
      like_count = -1;
      like_users = arrayRemove(userData.user_id);
    }

    if (type === "origin") {
      dispatch(
        originCommentActions.likeComment({
          origin_index,
          like_count,
          user_id: userData.user_id,
        })
      );
    }

    if (origin_id && reply_index !== undefined) {
      if (type === "reply")
        dispatch(
          replyActions.likeComment({
            origin_id: origin_id!,
            reply_index: reply_index!,
            user_id,
            like_count,
          })
        );

      if (type === "my") {
        dispatch(
          myReplyActions.likeComment({
            origin_id,
            comment_id: createdAt + user_id,
            user_id,
            like_count,
          })
        );
      }
    }

    try {
      // Firestore 문서 업데이트
      const batch = writeBatch(db);
      const documentId = createdAt + user_id;

      const basePathOne = origin_id
        ? [origin_id, "comments", documentId]
        : [documentId];
      const docRef = doc(db, "comments", ...basePathOne);

      const basePathTwo = origin_id
        ? [origin_id, "comments", documentId, "like_users", userData.user_id]
        : [documentId, "like_users", userData.user_id];

      const userRef = doc(db, "comments", ...basePathTwo);

      batch.update(docRef, {
        like_count: increment(like_count),
        like_users: like_users,
      });

      if (like_count === 1) {
        batch.set(userRef, {
          origin_id,
          comment_id: createdAt + user_id,
          createdAt: time,
          content_title: comment_data.content_title,
          content_id: comment_data.content_id,
          content_type: comment_data.content_type,
          image_url: comment_data.image_url,
          content: comment_data.content,
          user_id: userData.user_id,
        });
      } else batch.delete(userRef);

      await batch.commit();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const replyHandler = () => {
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");
    dispatch(
      modalActions.clickReplyButton({ comment_id: createdAt + user_id })
    );
  };

  return (
    <div className="submenu">
      <div
        className={emotionOfRecord !== -1 ? "sub-box press-like" : "sub-box"}
      >
        <button onClick={feelClickHandler} type="button">
          <FontAwesomeIcon
            icon={emotionOfRecord !== -1 ? faSolidThumbsUp : faRegularThumbsUp}
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
