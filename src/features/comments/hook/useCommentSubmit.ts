import { replyComment, reviseComment } from "features/comments/api/firestoreUtils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import { originCommentActions } from "store/origin_comment-slice";
import { replyActions } from "store/reply-slice";
import { RootState, useAppDispatch } from "store/store";
import { CommentType } from "types/DataType";

const REVISE_ACTIONS: any = {
  origin: originCommentActions.reviseComment,
  reply: replyActions.reviseComment,
  my: myReplyActions.reviseComment,
};

export const useCommentSubmit = (type: string, comment_data: CommentType) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const { current_user_id, current_user_name, current_user_photo } =
    useSelector((state: RootState) => state.firebase);

  const { createdAt, user_id, origin_id, user_name } = comment_data;
  const comment_id = createdAt + user_id;

  // --- A. 댓글 수정 (Revise) 핸들러 ---
  const handleRevise = async (text: string) => {
    if (!current_user_id) return alert("로그인이 필요합니다");
    if (!text.trim()) return alert("내용을 입력해주세요");

    setLoading(true);
    const updatedAt = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(); // UTC 표준 시간

    try {
      // 1. Firebase API 호출
      await reviseComment(text, comment_id, updatedAt);

      // 2. Redux State 업데이트 (화면 즉시 반영)
      const actionCreator = REVISE_ACTIONS[type];
      if (actionCreator) {
        dispatch(actionCreator({ text, comment_id, updatedAt }));
      }

      // 3. 모달 닫기 (수정 종료)
      dispatch(modalActions.clearModalInfo({ comment_id, type: "revise" }));
    } catch (error) {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- B. 대댓글 작성 (Reply) 핸들러 ---
  const handleReply = async (text: string) => {
    if (!current_user_id) return alert("로그인이 필요합니다.");
    if (!text.trim()) return alert("내용을 입력해주세요.");

    setLoading(true);

    const timestamp = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString();

    const isReplyToReply = origin_id ? true : false;
    const originId = origin_id || comment_id;
    // 여기도 문제가 있음.
    const document_id = timestamp + current_user_id;

    const field_data: CommentType = {
      content_type: comment_data.content_type,
      content_id: comment_data.content_id,
      content_title: comment_data.content_title,
      text,
      user_id: current_user_id,
      user_name: current_user_name,
      user_photo: current_user_photo,
      createdAt: timestamp,
      origin_id: originId,
      parent_id: isReplyToReply ? comment_id : null,
      parent_name: isReplyToReply ? user_name : null,
      parent_user_id: origin_id ? user_id : null,
      like_count: 0,
      reply_count: 0,
      updatedAt: null,
      image_url: comment_data.image_url,
      like_users: {},
    };

    try {
      // 1. Firestore API 호출
      await replyComment(originId, document_id, field_data);

      dispatch(
        myReplyActions.addNewMyReply({
          origin_id: originId,
          comment_id: document_id,
          comment_data: field_data,
        }),
      );

      dispatch(modalActions.clearModalInfo({ comment_id, type: "reply" }));
    } catch (error) {
      console.error(error);
      alert("답글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleRevise, handleReply };
};
