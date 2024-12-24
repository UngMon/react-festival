import { Comment, PickComment, UserData } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import { deleteField, doc, increment, updateDoc } from "firebase/firestore";
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
  originIndex: number;
  replyIndex?: number;
  commentData: Comment;
  userData: UserData;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const CommentResponse = ({
  type,
  originIndex,
  replyIndex,
  commentData,
  userData,
  setPickedComment,
  setComments,
  setReplyComments,
  setMyReply,
}: T) => {
  const user_id = userData.user_id;

  const feelClickHandler = async (emotion: string) => {
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");

    const commentId = commentData.createdAt + commentData.user_id;
    const docRef = doc(db, "comments", commentId);

    //commentData는 useState의 속성고 Comment 타입의 객체이므로 깊은 복사
    let updatedFeild: Comment = JSON.parse(JSON.stringify(commentData));

    // 댓글의 좋아요, 싫어요 카운트 설정
    let emotion_count = [0, 0];

    // 댓글에 좋아요, 싫어요 기록이 있는지에 관한 변수 생성
    const existingEmotion = updatedFeild.emotion[user_id];

    // 사용자가 이 댓글에 좋아요, 싫어요 버튼을 누른 기록이 있는 경우,
    if (existingEmotion === emotion) {
      // 같은 감정 표현 아이콘을 클릭하면 삭제 (초기화)
      delete updatedFeild.emotion[user_id];
      emotion_count = emotion === "좋아요" ? [-1, 0] : [0, -1];
    }

    if (existingEmotion && existingEmotion !== emotion) {
      // 다른 것을 클릭 (ex: 좋아요 -> 싫어요) value 변경
      updatedFeild.emotion[user_id] = emotion;
      emotion_count = emotion === "좋아요" ? [1, -1] : [-1, 1];
    }

    if (existingEmotion === undefined) {
      // 사용자가 이 댓글에 좋아요, 싫어요 버튼을 누른 기록이 없는 경우 추가,
      updatedFeild.emotion[user_id] = emotion;
      emotion_count = emotion === "좋아요" ? [1, 0] : [0, 1];
    }

    updatedFeild.like_count += emotion_count[0];
    updatedFeild.dislike_count += emotion_count[1];

    if (type === "origin")
      setComments((prevState) =>
        prevState.map((data, index) =>
          index !== originIndex ? data : updatedFeild
        )
      );

    if (type === "to-reply")
      setReplyComments((prevState) => ({
        ...prevState,
        [commentId]: prevState[commentId].map((data, index) =>
          index !== replyIndex ? data : updatedFeild
        ),
      }));

    if (type === "my")
      setMyReply((prevState) => ({
        ...prevState,
        [commentData.origin_id!]: {
          ...prevState[commentData.origin_id!],
          [commentId]: updatedFeild,
        },
      }));

    try {
      // Firestore 문서 업데이트
      await updateDoc(docRef, {
        [`emotion.${user_id}`]: !updatedFeild.emotion[user_id]
          ? deleteField()
          : emotion,
        like_count: increment(emotion_count[0]),
        dislike_count: increment(emotion_count[1]),
      });
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  const replyHandler = () => {
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");
    setPickedComment((prevState) => ({
      ...prevState,
      [commentData.createdAt + commentData.user_id]: "reply",
    }));
  };

  return (
    <div className="submenu">
      <div className="sub-box">
        <button onClick={() => feelClickHandler("좋아요")} type="button">
          <FontAwesomeIcon
            icon={
              commentData.emotion[user_id] === "좋아요"
                ? faSolidThumbsUp
                : faRegularThumbsUp
            }
          />
        </button>
        <span>{commentData.like_count}</span>
      </div>
      <div className="sub-box">
        <button type="button" onClick={() => feelClickHandler("싫어요")}>
          <FontAwesomeIcon
            icon={
              commentData.emotion[user_id] === "싫어요"
                ? faSolidThumbsDown
                : faRegularThumbsDown
            }
          />
        </button>
        <span>{commentData.dislike_count}</span>
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
