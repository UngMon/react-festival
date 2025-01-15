import { Comment, UserData } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import { deleteField, doc, increment, updateDoc } from "firebase/firestore";
import { useAppDispatch } from "../../../../redux/store";
import { originCommentActions } from "../../../../redux/origin_comment-slice";
import { replyActions } from "../../../../redux/reply-slice";
import { modalActions } from "../../../../redux/modal-slice";
import { myReplyActions } from "../../../../redux/my_reply-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faRegularThumbsUp,
  faThumbsDown as faRegularThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as faSolidThumbsUp,
  faThumbsDown as faSolidThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
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
  const { user_id, createdAt, origin_id, emotion, dislike_count, like_count } =
    comment_data;

  const feelClickHandler = async (emotion: string) => {
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");
    const docRef = doc(db, "comments", createdAt + user_id);

    //commentData는 useState의 속성고 Comment 타입의 객체이므로 깊은 복사
    let updatedField: Comment = JSON.parse(JSON.stringify(comment_data));

    // 댓글의 좋아요, 싫어요 카운트 설정
    let emotion_count = [0, 0];

    // 댓글에 좋아요, 싫어요 기록이 있는지에 관한 변수 생성
    const prevEmotion = updatedField.emotion[user_id];

    // 사용자가 이 댓글에 좋아요, 싫어요 버튼을 누른 기록이 있는 경우,
    if (prevEmotion === emotion) {
      // 같은 감정 표현 아이콘을 클릭하면 삭제 (초기화)
      delete updatedField.emotion[user_id];
      emotion_count = emotion === "좋아요" ? [-1, 0] : [0, -1];
    }

    if (prevEmotion && prevEmotion !== emotion) {
      // 다른 것을 클릭 (ex: 좋아요 -> 싫어요) value 변경
      updatedField.emotion[user_id] = emotion;
      emotion_count = emotion === "좋아요" ? [1, -1] : [-1, 1];
    }

    if (prevEmotion === undefined) {
      // 사용자가 이 댓글에 좋아요, 싫어요 버튼을 누른 기록이 없는 경우 추가,
      updatedField.emotion[user_id] = emotion;
      emotion_count = emotion === "좋아요" ? [1, 0] : [0, 1];
    }

    updatedField.like_count += emotion_count[0];
    updatedField.dislike_count += emotion_count[1];

    if (type === "origin") {
      dispatch(
        originCommentActions.updateComment({
          origin_index,
          type: "revise",
          updatedField,
        })
      );
    }

    if (origin_id && reply_index) {
      if (type === "reply")
        dispatch(
          replyActions.updateReply({ origin_id, reply_index, updatedField })
        );

      if (type === "my") {
        const comment_id = createdAt + user_id;
        dispatch(
          myReplyActions.updateMyReply({ origin_id, comment_id, updatedField })
        );
      }
    }

    try {
      // Firestore 문서 업데이트
      await updateDoc(docRef, {
        [`emotion.${user_id}`]: !updatedField.emotion[user_id]
          ? deleteField()
          : emotion,
        like_count: increment(emotion_count[0]),
        dislike_count: increment(emotion_count[1]),
      });
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
        className={emotion[user_id] === "좋아요" ? "sub-box like" : "sub-box"}
      >
        <button onClick={() => feelClickHandler("좋아요")} type="button">
          <FontAwesomeIcon
            icon={
              emotion[user_id] === "좋아요"
                ? faSolidThumbsUp
                : faRegularThumbsUp
            }
          />
        </button>
        <span>{like_count}</span>
      </div>
      <div
        className={
          emotion[user_id] === "싫어요" ? "sub-box dislike" : "sub-box"
        }
      >
        <button onClick={() => feelClickHandler("싫어요")}>
          <FontAwesomeIcon
            icon={
              emotion[user_id] === "싫어요"
                ? faSolidThumbsDown
                : faRegularThumbsDown
            }
          />
        </button>
        <span>{dislike_count}</span>
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
