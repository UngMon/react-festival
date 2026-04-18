import { useAuth } from "context/AuthContext";
import {
  replyComment,
  reviseComment,
} from "api/firestoreUtils";
import { useState } from "react";
import { modalActions } from "store/modal-slice";
import { myReplyActions } from "store/my_reply-slice";
import { originCommentActions } from "store/origin_comment-slice";
import { replyActions } from "store/reply-slice";
import { useAppDispatch } from "store/store";
import { CommentType } from "types/DataType";

const REVISE_ACTIONS: Record<string, any> = {
  origin: originCommentActions.reviseComment,
  reply: replyActions.reviseComment,
  my: myReplyActions.reviseComment,
};

export const useCommentSubmit = (
  role: string,
  mode: string,
  comment_data: CommentType,
) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const action = async (text: string) => {
    if (!user || !user.uid) return alert("로그인이 필요합니다");
    if (!text.trim()) return alert("내용을 입력해주세요");

    setLoading(true);

    try {
      const time = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(); // UTC 표준 시간

      const { createdAt, user_id, origin_id, user_name } = comment_data;
      const comment_id = createdAt + user_id;

      if (mode === "revise") {
        await reviseComment(text, comment_id, time);

        const actionCreator = REVISE_ACTIONS[role];
        if (actionCreator) {
          dispatch(actionCreator({ origin_id, text, comment_id, time }));
        }
      } else {
        const isReplyToReply = !!origin_id; // boolean 변환 명확화
        const originId = origin_id || comment_id;
        const document_id = time + user.uid;

        const field_data: CommentType = {
          content_type: comment_data.content_type,
          content_id: comment_data.content_id,
          content_title: comment_data.content_title,
          text,
          user_id: user.uid,
          user_name: user.displayName || "이름없음",
          user_photo: user.photoURL || "",
          createdAt: time,
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

        await replyComment(originId, document_id, field_data);

        dispatch(
          myReplyActions.addNewMyReply({
            origin_id: originId,
            comment_id: document_id,
            comment_data: field_data,
          }),
        );
      }

      // 작업 성공 시 모달 닫기
      dispatch(modalActions.toggleToastModal({ comment_id, mode }));
    } catch (error) {
      console.error(error);
      alert(`${mode === "revise" ? "수정" : "답글 작성"}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, action };
};
