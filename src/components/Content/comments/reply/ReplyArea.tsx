import { UserData } from "type/UserDataType";
import { Comment } from "type/DataType";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import CommentBox from "../Reviews/CommentBox";
import ReplyBox from "./ReplyBox";
import "./ReplyArea.css";

interface T {
  comment_data: Comment;
  origin_index: number;
}

const ReplyArea = ({ comment_data, origin_index }: T) => {
  const myReply = useSelector((state: RootState) => state.myReply);
  const { reply_count, createdAt, user_id } = comment_data;

  return (
    <div className="reply-area">
      {reply_count! > 0 && (
        <ReplyBox
          origin_index={origin_index}
          comment_data={comment_data}
          myReply={myReply}
        />
      )}
      {myReply[createdAt + user_id] &&
        Object.values(myReply[createdAt + user_id]).map((item, index) => (
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
