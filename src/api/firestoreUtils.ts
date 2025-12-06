import { LogItem, LikedComment } from "type/DataType";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  increment,
  deleteField,
  getDoc,
  getDocs,
  writeBatch,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

export const getUserLogs = async (
  category: string, // '좋아요 누른 댓글', '좋아요 누른 컨텐츠', '작성한 댓글'
  current_user_id: string, // 현재 사용자 id
  afterIndex: string // 해당 카테고리 데이터의 마지막 생성일자
): Promise<LogItem[]> => {
  let ref: CollectionReference<DocumentData> | null = null;
  const constraints: QueryConstraint[] = [];

  if (category === "myComment") {
    ref = collection(db, "comments");
    constraints.push(where("user_id", "==", current_user_id));
  } else if (category === "likedComment") {
    ref = collection(db, "userData", current_user_id, "liked_comments");
  } else if (category === "likedContent") {
    ref = collection(db, "userData", current_user_id, "liked_content");
  } else {
    // 모든 category에 해당하지 않을 경우를 처리 (필요에 따라 에러 처리 또는 기본값 설정)
    throw new Error("Invalid category specified");
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (afterIndex.length > 0) {
    constraints.push(startAfter(afterIndex));
  }

  constraints.push(limit(25));

  // 여러 조건이 담긴 쿼리문 작성
  const queryRef = query(ref, ...constraints);

  // 파이어스토어 댓글 문서들 불러오기
  const response = await getDocs(queryRef);
  const data = response.docs.map((doc) => doc.data()) as LogItem[];

  return data;
};

export const deleteLogItem = async (
  category: string,
  current_user_id: string,
  item: LogItem
): Promise<string | null> => {
  const batch = writeBatch(db);
  let documentRef: DocumentReference<DocumentData> | null = null;

  if (category === "likedComment") {
    // 좋아요 누른 댓글
    const { comment_id, createdAt } = item as LikedComment;
    const updateRef = doc(db, "comments", createdAt + item.user_id);

    batch.update(updateRef, {
      like_count: increment(-1),
      [`like_users.${current_user_id}`]: deleteField(),
    });

    documentRef = doc(
      db,
      "userData",
      current_user_id,
      "liked_comments",
      comment_id
    );
  } else if (category === "likedContent") {
    // 좋아요 누른 컨텐츠
    documentRef = doc(db, "userData", item.user_id, "content", item.content_id);
    const updateRef = doc(db, "content", item.content_id);
    batch.update(updateRef, {
      like_count: increment(-1),
    });
  } else if (category === "myComment") {
    // 내가 작성한 댓글
    const documentId = item.createdAt + item.user_id;
    documentRef = doc(db, "comments", documentId);
  }

  if (documentRef) batch.delete(documentRef);

  let updatedOriginId: string | null = null;

  if ("like_users" in item && item.origin_id) {
    const originDocRef = doc(db, "comments", item.origin_id);
    const originDoc = await getDoc(originDocRef);

    if (originDoc.exists()) {
      batch.update(originDocRef, {
        reply_count: increment(-1),
      });

      // ★ 중요: 오리진 댓글의 업데이트가 일어났음을 알리기 위해 ID 저장
      updatedOriginId = item.origin_id;
    }
  }

  await batch.commit();

  return updatedOriginId;
};
