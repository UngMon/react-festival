import { PickComment, UserData } from "../../../../type/UserDataType";
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
  userData: UserData;
  modalInfo: PickComment;
}

const UserComment = ({
  type,
  origin_index,
  reply_index,
  comment_data,
  userData,
  modalInfo,
}: T) => {
  return (
    <div className="comment-container">
      <UserIcon
        user_photo={comment_data.user_photo}
        user_name={comment_data.user_name}
      />
      <div className="top">
        <div>
          <span className="name">{comment_data.user_name}</span>
          {comment_data.isRevised && (
            <span className="revised">&nbsp;&nbsp;(수정됨)</span>
          )}
        </div>
        <CommentOption
          origin_index={origin_index}
          reply_index={reply_index}
          type={type}
          comment_data={comment_data}
          userData={userData}
          modalInfo={modalInfo}
        />
      </div>
      <div className="comment-text" style={{ whiteSpace: "pre-wrap" }}>
        <span>
          {comment_data.content?.map((comment, index) => {
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
        userData={userData}
      />
    </div>
  );
};

export default UserComment;
