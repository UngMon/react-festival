import React, { useState } from "react";
import { db } from "../../../../firebase";
import { Comment, PickComment } from "../../../../type/UserDataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import CommentBox from "../comment/CommentBox";
import LoadingSpinnerTwo from "../../../loading/LoadingSpinnerTwo";

interface T {
  originIndex: number;
  originData: Comment;
  replyComments: Record<string, Comment[]>;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  myReply: Record<string, Record<string, Comment>>;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const ReplyBox = ({
  originIndex,
  originData,
  replyComments,
  pickedComment,
  setPickedComment,
  setComments,
  setReplyComments,
  myReply,
  setMyReply,
}: T) => {
  console.log('Reply Box Render!')
  const [open, setOpen] = useState<boolean>(false);
  const [isFristMount, setIsFirstMount] = useState<boolean>(true);
  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const originUid = originData.createdAt + originData.user_id;

  const getReplyDataHandler = async () => {
    const commentRef = collection(db, "comments");

    try {
      const Query = query(
        commentRef,
        where("content_id", "==", originData.content_id),
        where("origin_id", "==", originUid),
        orderBy("createdAt"),
        limit(25)
      );

      const data = await getDocs(Query);
      const newCommentsData = data.docs.map((docs) => docs.data()) as Comment[];

      const originComment: Comment[] = JSON.parse(
        JSON.stringify(
          replyComments[originData.createdAt + originData.user_id] ?? []
        )
      );

      if (newCommentsData.length > 0) {
        // replies 속성에 배열을 담아야 합니다.
        originComment.push(...newCommentsData);

        setReplyComments((prevReply) => ({
          ...prevReply,
          [originData.createdAt + originData.user_id]: originComment,
        }));
      }

      if (newCommentsData.length < 50) setCompleteGetCommentsData(true);
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
    // setLoading(false);
  };

  const showRepliesHandler = () => {
    if (isFristMount) {
      setIsFirstMount(false);
      // setLoading(true);
      getReplyDataHandler();
    }

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
        <span>{`${originData.reply_count}개의 답글 보기`}</span>
      </div>
      {open &&
        replyComments[originUid]?.map((item, index) => {
          console.log(index);
          const replyKey = item.createdAt + item.user_id;

          if (myReply[originUid]?.[replyKey] === undefined)
            return (
              <CommentBox
                key={replyKey}
                originIndex={originIndex}
                replyIndex={index}
                type={"to-reply"}
                deepth={0}
                commentData={item}
                pickedComment={pickedComment}
                setPickedComment={setPickedComment}
                setComments={setComments}
                setReplyComments={setReplyComments}
                setMyReply={setMyReply}
              />
            );

          return null;
        })}
      {loading ? (
        <LoadingSpinnerTwo width="25px" padding="8px" />
      ) : (
        open &&
        !completeGetCommentsData && (
          <button
            className="reply_more"
            type="button"
            onClick={() => {
              setLoading(true);
              getReplyDataHandler();
            }}
          >
            <span>답글 더보기</span>
          </button>
        )
      )}
    </>
  );
};

export default ReplyBox;
