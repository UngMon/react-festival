import React from "react";
import { CommentType } from "types/DataType";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import Comment from "../comment/Comment";
import ReplyOrRevise from "../replyrevise/ReplyOrRevise";

interface T {
  role: string;
  depth: number;
  comment_data: CommentType;
}

const CommentBox = ({ role, depth, comment_data }: T) => {
  const comment_id = comment_data.createdAt + comment_data.user_id;
  const isRevise = useSelector(
    (state: RootState) => state.modal.revise[comment_id],
  );
  const isReply = useSelector(
    (state: RootState) => state.modal.reply[comment_id],
  );

  // category => origin, reply, my 3가지 형태
  return (
    <>
      {!isRevise ? (
        <Comment role={role} comment_data={comment_data} />
      ) : (
        <ReplyOrRevise
          role={role}
          mode={"revise"}
          depth={0}
          comment_data={comment_data}
        />
      )}
      {isReply && (
        <ReplyOrRevise
          role={role}
          mode={"reply"}
          depth={depth + 1}
          comment_data={comment_data}
        />
      )}
    </>
  );
};

export default React.memo(CommentBox);
