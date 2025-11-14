import React, { useState } from "react";
import { CommentType } from "type/DataType";
import Replies from "./Replies";
import MyReply from "./MyReply";
import MoreReplyButton from "./MoreReplyButton";
import ShowReplies from "./ShowReplies";
import "./ReplyArea.css";

interface T {
  comment_data: CommentType;
}

const ReplyArea = ({ comment_data }: T) => {
  console.log("ReplyArea Rendering");
  const [open, setOpen] = useState(false);
  const { reply_count, createdAt, user_id, content_id } = comment_data;

  const origin_id = createdAt + user_id;
  const isExisting = open && reply_count > 0;

  return (
    <div className="reply-area">
      {reply_count > 0 && (
        <ShowReplies
          open={open}
          setOpen={setOpen}
          reply_count={reply_count}
          origin_id={origin_id}
          content_id={content_id}
        />
      )}
      {isExisting && <Replies origin_id={origin_id} />}
      <MyReply origin_id={origin_id} />
      {isExisting && (
        <MoreReplyButton origin_id={origin_id} content_id={content_id} />
      )}
    </div>
  );
};

export default React.memo(ReplyArea);
//   return (
//     <div className="reply-area">
//       {reply_count > 0 && (
//         <ShowReplies
//           open={open}
//           setOpen={setOpen}
//           reply_count={reply_count}
//           origin_id={origin_id}
//           content_id={content_id}
//         />
//       )}
//       {isExisting && (
//         <Replies origin_id={origin_id} origin_index={origin_index} />
//       )}
//       <MyReply origin_id={origin_id} origin_index={origin_index} />
//       {isExisting && (
//         <MoreReplyButton
//           origin_id={origin_id}
//           content_id={content_id}
//         />
//       )}
//     </div>
//   );
// };
