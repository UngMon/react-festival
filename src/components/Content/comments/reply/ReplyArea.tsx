import { Comment } from "../../../../type/UserDataType";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import CommentBox from "../comment/CommentBox";
import ReplyBox from "./ReplyBox";
import "./ReplyArea.css";

interface T {
  comment_data: Comment;
  origin_index: number;
}

const ReplyArea = ({ comment_data, origin_index }: T) => {
  const myReply = useSelector((state: RootState) => state.myReply);

  return (
    <div className="reply-area">
      {comment_data.reply_count > 0 && (
        <ReplyBox
          origin_index={origin_index}
          comment_data={comment_data}
          myReply={myReply}
        />
      )}
      {myReply[comment_data.createdAt + comment_data.user_id] &&
        Object.values(
          myReply[comment_data.createdAt + comment_data.user_id]
        ).map((item, index) => (
          <CommentBox
            origin_index={origin_index}
            reply_index={index}
            key={item.createdAt + item.user_id}
            deepth={0}
            type={"my"}
            comment_data={item}
          />
        ))}
    </div>
  );
};

export default ReplyArea;
