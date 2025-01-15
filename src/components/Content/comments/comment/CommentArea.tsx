import { useEffect, useState } from "react";
import { Comment } from "../../../../type/UserDataType";
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
import { RootState, useAppDispatch } from "../../../../redux/store";
import { originCommentActions } from "../../../../redux/origin_comment-slice";
import useIntersectionObserver from "../../../../hooks/useIntersectionObserver";
import CommentBox from "./CommentBox";
import LoadingSpinnerTwo from "../../../loading/LoadingSpinnerTwo";
import ReplyArea from "../reply/ReplyArea";

interface T {
  content_id: string;
}

const CommentArea = ({ content_id }: T) => {
  console.log("CommentBox Component Render");
  const [loading, setLoading] = useState<boolean>(false);
  const comments = useSelector(
    (state: RootState) => state.origin_comment.comment
  );
  const dispatch = useAppDispatch();

  const [completeGetCommentsData, setCompleteGetCommentsData] =
    useState<boolean>(false);
  const [targetRef, intersecting, setIntersecting] =
    useIntersectionObserver(false);

  useEffect(() => {
    if (completeGetCommentsData || !intersecting || loading) return;
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
          startAfter(comments[comments.length - 1]?.createdAt || "0"),
          limit(25)
        );

        let querySnapshot = comments.length === 0 ? firstQuery : baseQurey;
        const data = await getDocs(querySnapshot);
        const comment_datas = data.docs.map((docs) => docs.data()) as Comment[];

        if (comment_datas.length > 0) {
          dispatch(originCommentActions.setComment({ comment_datas }));
        }

        if (comment_datas.length < 25) setCompleteGetCommentsData(true);
      } catch (error: any) {
        console.error(error.message);
        alert(error.message);
      }
      setIntersecting(false);
      setLoading(false);
    };
    getCommentData();
  }, [
    dispatch,
    completeGetCommentsData,
    loading,
    setIntersecting,
    comments,
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
              origin_index={index}
              type={"origin"}
              deepth={0}
              comment_data={item}
            />
            <ReplyArea origin_index={index} comment_data={item} />
          </div>
        ))}
      {loading && <LoadingSpinnerTwo width="25px" padding="8px" />}
      <div ref={targetRef}></div>
    </div>
  );
};

export default CommentArea;
