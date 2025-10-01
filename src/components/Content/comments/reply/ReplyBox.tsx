import { useState } from "react";
import { Comment } from "type/DataType";
import { RootState, useAppDispatch } from "store/store";
import { useSelector } from "react-redux";
import { replyActions } from "store/reply-slice";
import { fetchCommentData } from "api/fetchCommentData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import CommentBox from "../Reviews/CommentBox";
import LoadingSpinnerTwo from "../../../Loading/LoadingSpinnerTwo";

interface T {
  origin_index: number;
  comment_data: Comment;
  myReply: Record<string, Record<string, Comment>>;
}

const ReplyBox = ({ origin_index, comment_data, myReply }: T) => {
  console.log("Reply Box Render!");
  const dispatch = useAppDispatch();
  const { reply_comments, last_index } = useSelector(
    (state: RootState) => state.reply
  );
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { createdAt, user_id, content_id, reply_count } = comment_data;
  const origin_id = createdAt + user_id;

  const getReplyDataHandler = async () => {
    setLoading(true);

    try {
      const { comment_datas, lastDataIndex } = await fetchCommentData(
        origin_id,
        last_index[origin_id],
        content_id
      );
      console.log(comment_datas, lastDataIndex);
      dispatch(
        replyActions.setNewReply({ origin_id, comment_datas, lastDataIndex })
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  const showRepliesHandler = () => {
    if (last_index[origin_id] !== "finish") getReplyDataHandler();

    setOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="reply-count" onClick={showRepliesHandler}>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            transform: open ? "rotate(180deg)" : "",
          }}
        />
        <span>{`${reply_count}개의 답글 보기`}</span>
      </div>
      {open &&
        reply_comments[origin_id]?.map((item, index) => {
          const replyKey = item.createdAt + item.user_id;

          if (myReply[origin_id]?.[replyKey] === undefined) {
            return (
              <CommentBox
                key={replyKey}
                origin_index={origin_index}
                reply_index={index}
                type={"reply"}
                deepth={0}
                comment_data={item}
              />
            );
          } else return null;
        })}
      {loading ? (
        <LoadingSpinnerTwo width="25px" padding="8px" />
      ) : (
        open &&
        last_index[origin_id] !== "finish" && (
          <button
            className="reply_more"
            type="button"
            onClick={getReplyDataHandler}
          >
            <span>답글 더보기</span>
          </button>
        )
      )}
    </>
  );
};

export default ReplyBox;
