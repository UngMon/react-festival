import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { CommentType } from "type/DataType";
import CommentBox from "../Reviews/CommentBox";

interface T {
  origin_id: string;
}

const MyReply = ({ origin_id }: T) => {
  const myReply = useSelector((state: RootState) => state.myReply);

  if (!myReply[origin_id]) return null;

  const myReplyArray: CommentType[] = Object.values(myReply[origin_id]);

  return (
    <>
      {myReplyArray.map((item) => (
        <CommentBox
          key={item.createdAt + item.user_id}
          deepth={0}
          type={"my"}
          comment_data={item}
        />
      ))}
    </>
  );
};

export default React.memo(MyReply);
