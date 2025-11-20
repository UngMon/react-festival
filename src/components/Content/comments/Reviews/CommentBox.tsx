import React from "react";
import { CommentType } from "../../../../type/DataType";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import Comment from "./Comment";
import ReplyComment from "./ReplyComment";
import ReviseComment from "./ReviseComment";

interface T {
  type: string;
  deepth: number;
  comment_data: CommentType;
}

const CommentBox = ({ type, deepth, comment_data }: T) => {
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
        <ReviseComment type={type} deepth={0} comment_data={comment_data} />
      )}
      {isReply && (
        <ReplyComment deepth={deepth + 1} comment_data={comment_data} />
      )}
    </>
  );
};

export default React.memo(CommentBox);