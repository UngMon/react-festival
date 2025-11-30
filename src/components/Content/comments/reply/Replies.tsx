import { RootState } from "store/store";
import { useSelector } from "react-redux";
import CommentBox from "../Reviews/CommentBox";

interface T {
  origin_id: string;
}

const Replies = ({ origin_id }: T) => {
  const reply_comments = useSelector(
    (state: RootState) => state.reply.reply_comments
  );

  return (
    <>
      {reply_comments[origin_id]?.map((item) => (
        <CommentBox
          key={item.createdAt + item.user_id}
          type={"reply"}
          deepth={0}
          comment_data={item}
        />
      ))}
    </>
  );
};

export default Replies;