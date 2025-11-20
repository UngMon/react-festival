import { CommentType } from "../../../../type/DataType";
import UserIcon from "./UserIcon";
import CommentOption from "./CommentOption";
import CommentResponse from "./CommentResponse";
import "./Comment.css";

interface T {
  type: string;
  comment_data: CommentType;
}

const Comment = ({ type, comment_data }: T) => {
  const {
    user_name,
    user_photo,
    text,
    updatedAt,
    user_id,
    parent_user_id,
    parent_name,
  } = comment_data;
  const isExistMention = parent_user_id && user_id !== parent_user_id;

  return (
    <div className="comment-container">
      <UserIcon user_photo={user_photo} user_name={user_name} />
      <div className="top">
        <div>
          <span className="name">{user_name}</span>
          {updatedAt && <span className="revised">&nbsp;&nbsp;(수정됨)</span>}
        </div>
        <CommentOption type={type} comment_data={comment_data} />
      </div>
      <div className="comment-text" style={{ whiteSpace: "pre-wrap" }}>
        {isExistMention && <span id="mention">{`@${parent_name}`}</span>}
        <span>{text}</span>
      </div>
      <CommentResponse type={type} comment_data={comment_data} />
    </div>
  );
};

export default Comment;
