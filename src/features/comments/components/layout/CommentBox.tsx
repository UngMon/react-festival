import React from "react";
import { CommentType } from "types/DataType";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import Comment from "../comment/Comment";
import ReplyComment from "../reply-or-revise/ReplyComment";
import ReviseComment from "../reply-or-revise/ReviseComment";

interface T {
  type: string;
  depth: number;
  comment_data: CommentType;
}

const CommentBox = ({ type, depth, comment_data }: T) => {
  const comment_id = comment_data.createdAt + comment_data.user_id;
  const isRevise = useSelector(
    (state: RootState) => state.modal.revise[comment_id]
  );
  const isReply = useSelector(
    (state: RootState) => state.modal.reply[comment_id]
  );

  return (
    <>
      {!isRevise ? (
        <Comment type={type} comment_data={comment_data} />
      ) : (
        <ReviseComment type={type} depth={0} comment_data={comment_data} />
      )}
      {isReply && (
        <ReplyComment depth={depth + 1} comment_data={comment_data} />
      )}
    </>
  );
};

export default React.memo(CommentBox);
