import {
  LogItem,
  LikedComment,
  CommentType,
  LikedContent,
} from "type/DataType";
import { ContentCommon } from "type/ContentType";
import { UserData } from "type/UserDataType";
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
  setDoc,
  getDoc,
  getDocs,
  writeBatch,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  DocumentReference,
  updateDoc,
  runTransaction,
} from "firebase/firestore";

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

export const submitCommentToFirestore = async (
  content_type: string,
  content_id: string,
  userData: UserData,
  detailCommon: ContentCommon[],
  text: string
): Promise<CommentType> => {
  const { current_user_id, current_user_name, current_user_photo } = userData;

  // 제목 추출
  const content_title =
    detailCommon?.[0]?.title || detailCommon?.[1]?.title || "제목 없음";
  // 이미지 추출
  const image_url =
    detailCommon?.[0]?.firstimage || detailCommon?.[0]?.firstimage2 || "";

  const createdAt = new Date(
    new Date().getTime() + 9 * 60 * 60 * 1000
  ).toISOString();

  const field_data: CommentType = {
    content_type,
    content_id,
    content_title,
    text,
    user_id: current_user_id,
    user_name: current_user_name,
    user_photo: current_user_photo,
    createdAt,
    origin_id: null,
    parent_id: null,
    parent_name: null,
    parent_user_id: null,
    like_count: 0,
    reply_count: 0,
    updatedAt: null,
    image_url,
    like_users: {},
  };

  const documentId = createdAt + current_user_id;

  const commentRef = doc(db, "comments", documentId);

  await setDoc(commentRef, field_data);

  return field_data;
};

export const likeButtonOfComment = async (
  like_count: number,
  current_user_id: string,
  comment_data: CommentType,
  emotionOfRecord: boolean
): Promise<void> => {
  const { createdAt, user_id, origin_id } = comment_data;
  const documentId = createdAt + user_id;

  const time: string = new Date(
    new Date().getTime() + 9 * 60 * 60 * 1000
  ).toISOString();

  const batch = writeBatch(db);
  const docRef = doc(db, "comments", documentId);
  const userRef = doc(
    db,
    "userData",
    current_user_id,
    "liked_comments",
    documentId
  );

  batch.update(docRef, {
    like_count: increment(like_count),
    [`like_users.${current_user_id}`]: emotionOfRecord ? deleteField() : true,
  });

  if (!emotionOfRecord) {
    batch.set(userRef, {
      origin_id,
      comment_id: createdAt + user_id,
      createdAt: time,
      content_title: comment_data.content_title,
      content_id: comment_data.content_id,
      content_type: comment_data.content_type,
      image_url: comment_data.image_url,
      text: comment_data.text,
      user_id: current_user_id,
    });
  } else batch.delete(userRef);

  await batch.commit();
};

export const replyComment = async (
  originId: string,
  document_id: string,
  field_data: CommentType
): Promise<void> => {
  const batch = writeBatch(db);

  const replyDocRef = doc(db, "comments", document_id);
  const originDocumentRef = doc(db, "comments", originId);

  batch.set(replyDocRef, field_data);
  batch.update(originDocumentRef, { reply_count: increment(1) });

  await batch.commit();
};

export const reviseComment = async (
  revisedText: string,
  comment_id: string,
  updatedAt: string
): Promise<void> => {
  const reviseDocRef = doc(db, "comments", comment_id);
  await updateDoc(reviseDocRef, { text: revisedText, updatedAt });
};

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

export const deleteComment = async (
  origin_id: string | null,
  comment_id: string
): Promise<boolean> => {
  const batch = writeBatch(db);
  let isExisingOrigin = false;

  if (origin_id) {
    const originalDocRef = doc(db, "comments", origin_id);
    const deleteDocRef = doc(db, "comments", comment_id);

    await runTransaction(db, async (transaction) => {
      const deleteDocSnapshot = await transaction.get(deleteDocRef);
      const originalDocSnapshot = await transaction.get(originalDocRef);

      if (originalDocSnapshot.exists()) {
        transaction.update(originalDocRef, {
          reply_count: increment(-1),
        });
        isExisingOrigin = true;
      }

      if (deleteDocSnapshot.exists()) transaction.delete(deleteDocRef);
    });
  } else {
    const originalDocRef = doc(db, "comments", comment_id);
    batch.delete(originalDocRef);
    await batch.commit();
  }

  return isExisingOrigin;
};

export const reportComment = async (
  comment_data: CommentType,
  current_user_id: string,
  current_user_name: string,
  report_reason: string
): Promise<void> => {
  const report_time = new Date(
    new Date().getTime() + 9 * 60 * 60 * 1000
  ).toISOString();

  const {
    content_type,
    content_id,
    content_title,
    text,
    user_id,
    user_name,
    createdAt,
  } = comment_data;

  const contentRef = doc(db, "reportList", report_time + current_user_id);

  await setDoc(contentRef, {
    content_type,
    content_id,
    content_title,
    createdAt,
    text,
    report_reason,
    reported_id: user_id,
    reported_name: user_name,
    reporter_id: current_user_id,
    reporter_name: current_user_name,
    report_time,
  });
};

export const deleteLogItem = async (
  category: string,
  current_user_id: string,
  item: LogItem
): Promise<string | null> => {
  const batch = writeBatch(db);
  let documentRef: DocumentReference<DocumentData> | null = null;
  let updatedOriginId: string | null = null;

  if (category === "likedComment") {
    // 좋아요 누른 댓글
    const { comment_id } = item as LikedComment;
    const commentRef = doc(db, "comments", comment_id);

    // ★ 중요: 댓글 문서가 실제로 존재하는지 먼저 확인합니다.
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      // A. 댓글이 존재하면 -> 댓글의 좋아요 수 감소 + 내 아이디 삭제
      batch.update(commentRef, {
        like_count: increment(-1),
        [`like_users.${current_user_id}`]: deleteField(),
      });
    }
    // B. 댓글이 없으면(이미 삭제됨) -> 댓글 업데이트는 건너뛰고, 아래에서 내 기록(userData)만 삭제하게 됨

    // 삭제할 내 기록(Log) 참조
    documentRef = doc(
      db,
      "userData",
      current_user_id,
      "liked_comments",
      comment_id
    );
  } else if (category === "likedContent") {
    // 좋아요 누른 컨텐츠
    const { content_id } = item as LikedContent;

    const updateRef = doc(db, "content", content_id);
    batch.update(updateRef, {
      like_count: increment(-1),
    });

    // 삭제할 내 기록(Log) 참조
    documentRef = doc(
      db,
      "userData",
      current_user_id,
      "liked_content",
      content_id
    );
  } else if (category === "myComment") {
    // 내가 작성한 댓글
    const { createdAt, user_id, origin_id } = item as CommentType;
    const documentId = createdAt + user_id;

    // 오리지널 댓글의 식별
    if (origin_id) {
      const originDocRef = doc(db, "comments", origin_id);
      const originDoc = await getDoc(originDocRef);

      if (originDoc.exists()) {
        batch.update(originDocRef, {
          reply_count: increment(-1),
        });

        // ★ 중요: 오리진 댓글의 업데이트가 일어났음을 알리기 위해 ID 저장
        updatedOriginId = origin_id;
      }
    }

    // 삭제할 내 기록(Log) 참조
    documentRef = doc(db, "comments", documentId);
  }

  if (documentRef) batch.delete(documentRef);

  await batch.commit();

  return updatedOriginId;
};
