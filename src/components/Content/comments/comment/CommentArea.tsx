import React, { useEffect, useState } from "react";
import { Comment, PickComment } from "../../../../type/UserDataType";
import { db } from "../../../../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useIntersectionObserver from "../../../../hooks/useIntersectionObserver";
import CommentBox from "./CommentBox";
import LoadingSpinnerTwo from "../../../loading/LoadingSpinnerTwo";
import DeleteModal from "../modal/DeleteModal";
import ReplyArea from "../reply/ReplyArea";

interface T {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  content_id: string;
}

const CommentArea = ({ comments, setComments, content_id }: T) => {
  console.log("CommentBox Component Render");
  const [loading, setLoading] = useState<boolean>(false);
  const [pickedComment, setPickedComment] = useState<PickComment>({
    originIndex: undefined,
    replyIndex: undefined,
    openOption: "",
    commentId: "",
    commentData: null,
    type: "",
  });
  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);
  const [replyComments, setReplyComments] = useState<Record<string, Comment[]>>(
    {}
  );
  const [myReply, setMyReply] = useState<
    Record<string, Record<string, Comment>>
  >({});

  useEffect(() => {
    if (completeGetCommentsData || !intersecting || loading) return;
    const commentRef = collection(db, "comments");

    setLoading(true);

    const getCommentData = async () => {
      try {
        const firstQuery = query(
          commentRef,
          where("content_id", "==", content_id),
          where("origin_id", "==", null),
          orderBy("createdAt", "desc"),
          limit(50)
        );

        const baseQurey = query(
          commentRef,
          where("content_id", "==", content_id),
          where("origin_id", "==", null),
          orderBy("createdAt", "desc"),
          startAfter(comments[comments.length - 1]?.createdAt || "0"),
          limit(50)
        );

        let querySnapshot = comments.length === 0 ? firstQuery : baseQurey;

        const data = await getDocs(querySnapshot);
        const newCommentsData = data.docs.map((docs) =>
          docs.data()
        ) as Comment[];

        // const jsonData = JSON.stringify(newCommentsData);
        // const dataSizeInBytes = new TextEncoder().encode(jsonData).length;

        // console.log(`Data size: ${dataSizeInBytes} bytes`);

        if (newCommentsData.length > 0)
          setComments([...comments.slice(0), ...newCommentsData]);

        if (newCommentsData.length < 50) setCompleteGetCommentsData(true);
      } catch (error: any) {
        console.log(error.message);
        alert(error.message);
      }
      setIntersecting(false);
      setLoading(false);
    };
    getCommentData();
  }, [
    completeGetCommentsData,
    loading,
    setIntersecting,
    comments,
    setComments,
    content_id,
    intersecting,
  ]);

  return (
    <div className="comments-area" style={{ margin: "50px 0", width: "100%" }}>
      {comments.length === 0 && !loading && <p>등록된 리뷰가 없습니다!</p>}
      {comments.length !== 0 &&
        comments.map((item, index) => (
          <div
            key={item.createdAt + item.user_id}
            style={{ margin: "0px 10px 10px", position: "relative" }}
          >
            <CommentBox
              originIndex={index}
              type={"origin"}
              deepth={0}
              commentData={item}
              pickedComment={pickedComment}
              setPickedComment={setPickedComment}
              setComments={setComments}
              setReplyComments={setReplyComments}
              setMyReply={setMyReply}
            />
            <ReplyArea
              originIndex={index}
              originData={item}
              replyComments={replyComments}
              pickedComment={pickedComment}
              setComments={setComments}
              setPickedComment={setPickedComment}
              setReplyComments={setReplyComments}
              myReply={myReply}
              setMyReply={setMyReply}
            />
          </div>
        ))}
      {loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
      {pickedComment[pickedComment.commentId] === "delete" && (
        <DeleteModal
          pickedComment={pickedComment}
          setComments={setComments}
          setPickedComment={setPickedComment}
          setReplyComments={setReplyComments}
          setMyReply={setMyReply}
        />
      )}
      <div ref={targetRef}></div>
    </div>
  );
};

export default CommentArea;
