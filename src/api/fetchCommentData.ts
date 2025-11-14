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
import { CommentType } from "type/DataType";

export const fetchCommentData = async (
  origin_id: string | null,
  afterIndex: string,
  content_id: string
) => {
  const commentRef = collection(db, "comments");

  let lastDataIndex: string = "";
  let comment_datas: CommentType[] = [];

  try {
    let queryConstraints: QueryConstraint[] = [
      where("content_id", "==", content_id),
      where("origin_id", "==", origin_id),
      orderBy("createdAt", origin_id ? "asc" : "desc"),
      limit(10),
    ];

    if (afterIndex) queryConstraints.push(startAfter(afterIndex));

    const queryToRun = query(commentRef, ...queryConstraints);
    const querySnapshot = await getDocs(queryToRun);

    comment_datas = querySnapshot.docs.map((doc) => doc.data()) as CommentType[];

    if (comment_datas.length > 0) lastDataIndex = comment_datas[comment_datas.length - 1].createdAt;
    if (comment_datas.length < 10) lastDataIndex = "finish";
  } catch (error) {
    lastDataIndex = "finish";
    throw error;
  } finally {
    return { comment_datas, lastDataIndex };
  }
};
