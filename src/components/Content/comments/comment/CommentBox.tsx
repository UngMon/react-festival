import React from "react";
import { Comment, PickComment } from "../../../../type/UserDataType";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import UserComment from "./UserComment";
import ReplyOrReviseComment from "./ReplyOrReviseComment";

interface T {
  originIndex: number;
  replyIndex?: number;
  deepth: number;
  type: string;
  commentData: Comment;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const CommentBox = ({
  originIndex,
  replyIndex,
  deepth,
  type,
  commentData,
  pickedComment,
  setPickedComment,
  setComments,
  setReplyComments,
  setMyReply,
}: T) => {
  const userData = useSelector((state: RootState) => state.firebase);
  const comment_id = commentData.createdAt + commentData.user_id;

  return (
    <>
      {pickedComment[comment_id] !== "revise" ? (
        <UserComment
          type={type}
          originIndex={originIndex}
          replyIndex={replyIndex}
          commentData={commentData}
          userData={userData}
          pickedComment={pickedComment}
          setPickedComment={setPickedComment}
          setComments={setComments}
          setReplyComments={setReplyComments}
          setMyReply={setMyReply}
        />
      ) : (
        <ReplyOrReviseComment
          originIndex={originIndex}
          replyIndex={replyIndex}
          deepth={deepth}
          commentData={commentData}
          userData={userData}
          type={"revise-" + type}
          setPickedComment={setPickedComment}
          setComments={setComments}
          setReplyComments={setReplyComments}
          setMyReply={setMyReply}
        />
      )}
      {pickedComment[comment_id] === "reply" && (
        <ReplyOrReviseComment
          originIndex={originIndex}
          replyIndex={replyIndex}
          deepth={1}
          commentData={commentData}
          userData={userData}
          type={"reply-" + type}
          setPickedComment={setPickedComment}
          setComments={setComments}
          setReplyComments={setReplyComments}
          setMyReply={setMyReply}
        />
      )}
    </>
  );
};

export default CommentBox;
