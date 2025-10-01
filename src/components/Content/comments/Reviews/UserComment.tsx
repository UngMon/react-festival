import { PickComment } from "../../../../type/UserDataType";
import { Comment } from "../../../../type/DataType";
import UserIcon from "./UserIcon";
import CommentOption from "./CommentOption";
import CommentResponse from "./CommentResponse";
import "./UserComment.css";

interface T {
  type: string;
  origin_index: number;
  reply_index?: number;
  comment_data: Comment;
  modalInfo: PickComment;
}

const UserComment = ({
  type,
  origin_index,
  reply_index,
  comment_data,
  modalInfo,
}: T) => {
  const { user_name, user_photo, text, updatedAt } = comment_data;

  return (
    <div className="comment-container">
      <UserIcon user_photo={user_photo} user_name={user_name} />
      <div className="top">
        <div>
          <span className="name">{user_name}</span>
          {updatedAt && <span className="revised">&nbsp;&nbsp;(수정됨)</span>}
        </div>
        <CommentOption
          type={type}
          origin_index={origin_index}
          reply_index={reply_index}
          comment_data={comment_data}
          modalInfo={modalInfo}
        />
      </div>
      <div className="comment-text" style={{ whiteSpace: "pre-wrap" }}>
        <span>
          {text?.map((comment, index) => {
            if (index === 1 && comment.length > 0) {
              return <span key={index}>{comment}</span>;
            } else return comment;
          })}
        </span>
      </div>
      <CommentResponse
        type={type}
        origin_index={origin_index}
        reply_index={reply_index}
        comment_data={comment_data}
      />
    </div>
  );
};

export default UserComment;
