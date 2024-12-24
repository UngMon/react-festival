import { Comment, PickComment, UserData } from "../../../../type/UserDataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import UserIcon from "./UserIcon";
import CommentResponse from "./CommentResponse";
import OptionModal from "../modal/OptionModal";
import "./UserComment.css";

interface T {
  originIndex: number;
  replyIndex?: number;
  type: string;
  commentData: Comment;
  userData: UserData;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const UserComment = ({
  originIndex,
  replyIndex,
  type,
  commentData,
  userData,
  pickedComment,
  setPickedComment,
  setComments,
  setReplyComments,
  setMyReply,
}: T) => {
  const pickedKey = commentData.createdAt + commentData.user_id;

  const optionClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (pickedComment.commentId === pickedKey) {
      // 같은 댓글의 옵션 버튼을 클릭할 경우, pickedComment 상태 초기화
      setPickedComment((prevState) => ({
        ...prevState,
        openOption: "",
        commentData: null,
        commentId: "",
        originIndex: undefined,
        replyIndex: undefined,
        type: "",
      }));
    } else {
      // 다른 댓글의 옵션 버튼을 클릭할 경우, pcikedComment 상태 갱신
      setPickedComment((prevState) => ({
        ...prevState,
        openOption: pickedKey,
        commentData,
        commentId: pickedKey,
        originIndex,
        replyIndex,
        type,
      }));
    }
  };

  return (
    <div className="comment-container">
      <UserIcon
        user_photo={commentData.user_photo}
        user_name={commentData.user_name}
      />
      <div className="top">
        <span className="name">{commentData.user_name}</span>
        {commentData.isRevised && (
          <span className="revi">&nbsp;&nbsp;(수정됨)</span>
        )}
        <FontAwesomeIcon
          className="comment-option"
          onClick={(event) => optionClickHandler(event)}
          icon={faEllipsisVertical}
        />
      </div>
      <div className="comment-text" style={{ whiteSpace: "pre-wrap" }}>
        <span>
          {commentData.content.map((comment, index) => {
            if (index === 1 && comment.length > 0) {
              return <span key={index}>{comment}</span>;
            } else return comment;
          })}
        </span>
      </div>
      <CommentResponse
        type={type}
        originIndex={originIndex}
        replyIndex={replyIndex}
        commentData={commentData}
        userData={userData}
        setPickedComment={setPickedComment}
        setComments={setComments}
        setReplyComments={setReplyComments}
        setMyReply={setMyReply}
      />
      {pickedComment.openOption === pickedKey && (
        <OptionModal
          commentData={commentData}
          userData={userData}
          setPickedComment={setPickedComment}
        />
      )}
    </div>
  );
};

export default UserComment;
