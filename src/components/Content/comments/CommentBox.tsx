import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import {
  Comment,
  PickComment,
  Report,
  UserData,
} from "../../../type/UserDataType";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import LoadingSpinnerTwo from "../../loading/LoadingSpinnerTwo";
import ReplyOrReviseComment from "./ReplyOrReviseComment";
import UserComment from "./UserComment";
import DeleteModal from "./modal/DeleteModal";
import ReplyBox from "./ReplyBox";

interface T {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  contentId: string;
  state: { loading: boolean };
  dispatch: (value: { type: "pending" | "fulfiled" | "reject" }) => void;
  userData: UserData;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
}

const CommentBox = ({
  comments,
  setComments,
  contentId,
  state,
  dispatch,
  userData,
  setReportModal,
}: T) => {
  console.log("CommentBox Component Render");
  const [pickedComment, setPickedComment] = useState<PickComment>({ open: "" });
  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);
  const clickedElement = useRef<HTMLDivElement | null>(null);
  const [replyComments, setReplyComments] = useState<Record<string, Comment[]>>(
    {}
  );

  useEffect(() => {
    if (completeGetCommentsData || !intersecting || state.loading) return;
    const commentRef = collection(db, "comments");

    const getCommentData = async () => {
      dispatch({ type: "pending" });

      try {
        const firstQuery = query(
          commentRef,
          where("contentId", "==", contentId),
          where("originUid", "==", null),
          orderBy("createdAt", "desc"),
          limit(50)
        );

        const baseQurey = query(
          commentRef,
          where("contentId", "==", contentId),
          where("originUid", "==", null),
          orderBy("createdAt", "desc"),
          startAfter("1"),
          limit(50)
        );

        let querySnapshot = comments.length === 0 ? firstQuery : baseQurey;

        const data = await getDocs(querySnapshot);
        const newCommentsData = data.docs.map((docs) =>
          docs.data()
        ) as Comment[];
        console.log(newCommentsData);
        if (newCommentsData.length > 0)
          setComments([...comments.slice(0), ...newCommentsData]);

        if (newCommentsData.length < 50) setCompleteGetCommentsData(true);

        dispatch({ type: "fulfiled" });
      } catch (error: any) {
        console.log(error.message);
        alert(error.message);
        dispatch({ type: "reject" });
      }
      setIntersecting(false);
    };
    getCommentData();
  }, [
    dispatch,
    completeGetCommentsData,
    state,
    setIntersecting,
    comments,
    setComments,
    contentId,
    intersecting,
  ]);

  // console.log(pickedComment);
  return (
    <div className="comments-area" style={{ margin: "50px 0", width: "100%" }}>
      {comments.length === 0 && !state.loading && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {comments.length !== 0 &&
        comments.map((item, index) => (
          <div key={index}>
            <UserComment
              index={index}
              item={item}
              userData={userData}
              pickedComment={pickedComment}
              setPickedComment={setPickedComment}
              setComments={setComments}
              clickedElement={clickedElement}
              setReportModal={setReportModal}
              setReplyComments={setReplyComments}
            />
            {pickedComment[item.createdAt + item.uid] === "reply" && (
              <ReplyOrReviseComment
                originIndex={index}
                index={index}
                originData={item}
                userData={userData}
                isRevise={false}
                setComments={setComments}
                setPickedComment={setPickedComment}
                setReplyComments={setReplyComments}
              />
            )}
            {item.reply_count > 0 && (
              <ReplyBox
                origin={item}
                replyComments={replyComments}
                userData={userData}
                clickedElement={clickedElement}
                pickedComment={pickedComment}
                setPickedComment={setPickedComment}
                setReportModal={setReportModal}
                setReplyComments={setReplyComments}
                setComments={setComments}
                dispatch={dispatch}
              />
            )}
            {pickedComment[item.createdAt + item.uid] === "delete" && (
              <DeleteModal
                item={item}
                originIndex={index}
                index={index}
                setComments={setComments}
                setPickedComment={setPickedComment}
                setReplyComments={setReplyComments}
              />
            )}
          </div>
        ))}
      {state.loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
      <div ref={targetRef}></div>
    </div>
  );
};

export default CommentBox;
