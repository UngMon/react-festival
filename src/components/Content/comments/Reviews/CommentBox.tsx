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
  console.log("Comment Box origin_index:", comment_data.text);
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
//  {!isRevise ? (
//     <Comment
//       type={type}
//       // origin_index={origin_index}
//       // reply_index={reply_index}
//       comment_data={comment_data}
//       // modalInfo={modalInfo}
//     />
//   ) : (
//     <ReplyOrReviseComment
//       deepth={deepth}
//       type={"revise-" + type}
//       // origin_index={origin_index}
//       // reply_index={reply_index}
//       comment_data={comment_data}
//     />
//   )}
//   {isReply && (
//     <ReplyOrReviseComment
//       deepth={1}
//       type={"reply-" + type}
//       // origin_index={origin_index}
//       // reply_index={reply_index}
//       comment_data={comment_data}
//     />
//   )}
