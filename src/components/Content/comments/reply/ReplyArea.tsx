import { Comment, PickComment } from "../../../../type/UserDataType";
import CommentBox from "../comment/CommentBox";
import ReplyBox from "./ReplyBox";
import "./ReplyArea.css";

interface T {
  originIndex: number;
  originData: Comment;
  replyComments: Record<string, Comment[]>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  myReply: Record<string, Record<string, Comment>>;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const ReplyArea = ({
  originIndex,
  originData,
  replyComments,
  setComments,
  pickedComment,
  setPickedComment,
  setReplyComments,
  myReply,
  setMyReply,
}: T) => {

  return (
    <div className="reply-area">
      {originData.reply_count > 0 && (
        <ReplyBox
          originIndex={originIndex}
          originData={originData}
          replyComments={replyComments}
          pickedComment={pickedComment}
          setPickedComment={setPickedComment}
          setComments={setComments}
          setReplyComments={setReplyComments}
          myReply={myReply}
          setMyReply={setMyReply}
        />
      )}
      {myReply[originData.createdAt + originData.user_id] &&
        Object.values(myReply[originData.createdAt + originData.user_id]).map(
          (item, index) => (
            <CommentBox
              originIndex={originIndex}
              key={item.createdAt + item.user_id}
              replyIndex={index}
              deepth={0}
              type={"my"}
              commentData={item}
              pickedComment={pickedComment}
              setPickedComment={setPickedComment}
              setComments={setComments}
              setReplyComments={setReplyComments}
              setMyReply={setMyReply}
            />
          )
        )}
    </div>
  );
};

export default ReplyArea;
