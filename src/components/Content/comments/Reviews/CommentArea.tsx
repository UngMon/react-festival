import { useEffect, useState } from "react";
import { Comment } from "../../../../type/DataType";
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
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../store/store";
import { originCommentActions } from "../../../../store/origin_comment-slice";
import { useIntersectionObserver } from "../../../../hooks/useIntersectionObserver";
import CommentBox from "./CommentBox";
import LoadingSpinnerTwo from "../../../Loading/LoadingSpinnerTwo";
import ReplyArea from "../Reply/ReplyArea";

interface T {
  content_id: string;
}

const CommentArea = ({ content_id }: T) => {
  console.log("CommentBox Component Render");
  const [loading, setLoading] = useState<boolean>(false);
  const comments = useSelector(
    (state: RootState) => state.origin_comment.comment
  );
  const userData = useSelector((state: RootState) => state.firebase);
  const dispatch = useAppDispatch();

  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);
  const [afterIndex, setAfterIndex] = useState<string>("");

  useEffect(() => {
    switch (true) {
      case completeGetCommentsData:
        return;
      case loading:
        return;
      case userData.status === "pending":
        return;
      case !intersecting:
        return;
    }
    setLoading(true);

    const commentRef = collection(db, "comments");

    const getCommentData = async () => {
      try {
        const firstQuery = query(
          commentRef,
          where("content_id", "==", content_id),
          where("origin_id", "==", null),
          orderBy("createdAt", "desc"),
          limit(25)
        );

        const baseQurey = query(
          commentRef,
          where("content_id", "==", content_id),
          where("origin_id", "==", null),
          orderBy("createdAt", "desc"),
          startAfter(afterIndex),
          limit(25)
        );

        let querySnapshot = comments.length === 0 ? firstQuery : baseQurey;

        const data = await getDocs(querySnapshot);
        let lastDataIndex: string = "";

        if (data) {
          const comment_datas = data.docs.map((doc) => doc.data()) as Comment[];
          if (comment_datas.length > 0) {
            lastDataIndex = comment_datas[comment_datas.length - 1].createdAt;
            dispatch(originCommentActions.setComment({ comment_datas }));
            setAfterIndex(lastDataIndex);
          }
          if (comment_datas.length < 25) setCompleteGetCommentsData(true);
        } else setCompleteGetCommentsData(true);
      } catch (error: any) {
        console.error(error.message);
        alert("댓글을 불러오지 못 했습니다.");
      }
      setIntersecting(false);
      setLoading(false);
    };
    getCommentData();
  }, [
    dispatch,
    userData,
    completeGetCommentsData,
    loading,
    setIntersecting,
    comments,
    afterIndex,
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
              userData={userData}
              origin_index={index}
              type={"origin"}
              deepth={0}
              comment_data={item}
            />
            <ReplyArea
              origin_index={index}
              comment_data={item}
              userData={userData}
            />
          </div>
        ))}
      {loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
      <div ref={targetRef}></div>
    </div>
  );
};

export default CommentArea;
