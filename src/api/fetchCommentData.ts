import { db } from "../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
} from "firebase/firestore";
import { Comment } from "type/DataType";

export const fetchCommentData = async (
  type: string,
  origin_id: string,
  afterIndex: string,
  content_id: string
) => {
  const documentArray = type === "reply" ? [origin_id, "comments"] : [];
  const commentRef = collection(db, "comments", ...documentArray);

  let lastDataIndex: string = "";
  let comment_datas: Comment[] = [];

  try {
    let queryConstraints: QueryConstraint[] = [
      where("content_id", "==", content_id),
      where("origin_id", "==", type === 'reply' ? origin_id : null),
      orderBy("createdAt", type === "origin" ? "desc" : "asc"),
      limit(4),
    ];

    if (afterIndex) queryConstraints.push(startAfter(afterIndex));

    const queryToRun = query(commentRef, ...queryConstraints);
    const querySnapshot = await getDocs(queryToRun);

    comment_datas = querySnapshot.docs.map((doc) => doc.data()) as Comment[];
    if (comment_datas.length > 0)
      lastDataIndex = comment_datas[comment_datas.length - 1].createdAt;

    if (comment_datas.length < 4) lastDataIndex = "finish";
  } catch (error) {
    lastDataIndex = "finish";
    console.error(error);
    throw error;
  } finally {
    console.log(comment_datas, lastDataIndex);
    return { comment_datas, lastDataIndex };
  }
};
