import { useEffect, useRef, useState } from "react";
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
import "./CommentArea.css";

interface T {
  content_id: string;
}

const CommentArea = ({ content_id }: T) => {
  console.log("CommentBox Component Render");
  const dispatch = useAppDispatch();
  const comments = useSelector(
    (state: RootState) => state.origin_comment.comment
  );
  const loading = useRef<boolean>(false);
  const [targetRef, intersecting] = useIntersectionObserver();
  const [afterIndex, setAfterIndex] = useState<string>("");

  useEffect(() => {
    if (afterIndex === "finish" || !intersecting || loading.current) return;

    const getCommentData = async () => {
      loading.current = true;
      const commentRef = collection(db, "comments");

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

        let queryToRun = afterIndex === "" ? firstQuery : baseQurey;
        const data = await getDocs(queryToRun);
        let lastDataIndex: string = "";

        if (data) {
          const comment_datas = data.docs.map((doc) => doc.data()) as Comment[];
          if (comment_datas.length > 0) {
            lastDataIndex = comment_datas[comment_datas.length - 1].createdAt;
            dispatch(originCommentActions.setComment({ comment_datas }));
            setAfterIndex(lastDataIndex);
          }
          if (comment_datas.length < 25) setAfterIndex("finish");
        } else setAfterIndex("finish");
      } catch (error: any) {
        console.error(error.message);
        alert("댓글을 불러오지 못 했습니다.");
      } finally {
        setTimeout(() => {
          loading.current = false;
        }, 100);
      }
    };

    getCommentData();
  }, [dispatch, intersecting, afterIndex, content_id]);

  return (
    <div className="comments-area">
      {comments.length === 0 && afterIndex === "finish" && (
        <p>등록된 리뷰가 없습니다!</p>
      )}
      {comments.length > 0 &&
        comments.map((item, index) => (
          <div
            className="comment-box-container"
            key={item.createdAt + item.user_id}
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
      <div className="comment-target" ref={targetRef}>
        {intersecting && afterIndex !== "finish" && (
          <LoadingSpinnerTwo width="20px" padding="7px" />
        )}
      </div>
    </div>
  );
};

export default CommentArea;
