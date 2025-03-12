import { UserData } from "../../../../type/UserDataType";
import { Comment } from "../../../../type/DataType";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import UserComment from "./UserComment";
import ReplyOrReviseComment from "./ReplyOrReviseComment";

interface T {
  userData: UserData
  origin_index: number;
  reply_index?: number;
  deepth: number;
  type: string;
  comment_data: Comment;
}

const CommentBox = ({
  userData,
  origin_index,
  reply_index,
  deepth,
  type,
  comment_data,
}: T) => {
  const comment_id = comment_data.createdAt + comment_data.user_id;
  const modalInfo = useSelector((state: RootState) => state.modal);

  return (
    <>
      {modalInfo.revise[comment_id] !== "revise" ? (
        <UserComment
          type={type}
          origin_index={origin_index}
          reply_index={reply_index}
          comment_data={comment_data}
          userData={userData}
          modalInfo={modalInfo}
        />
      ) : (
        <ReplyOrReviseComment
          deepth={deepth}
          type={"revise-" + type}
          origin_index={origin_index}
          reply_index={reply_index}
          comment_data={comment_data}
          userData={userData}
        />
      )}
      {!modalInfo.revise[comment_id] &&
        modalInfo.reply[comment_id] === "reply" && (
          <ReplyOrReviseComment
            deepth={1}
            type={"reply-" + type}
            origin_index={origin_index}
            reply_index={reply_index}
            comment_data={comment_data}
            userData={userData}
          />
        )}
    </>
  );
};

export default CommentBox;
