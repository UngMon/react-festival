import React, { useEffect, useRef, useState } from "react";
import { Comment, UserData } from "../../../../type/UserDataType";
import { useAppDispatch } from "../../../../redux/store";
import { originCommentActions } from "../../../../redux/origin_comment-slice";
import { replyActions } from "../../../../redux/reply-slice";
import { myReplyActions } from "../../../../redux/my_reply-slice";
import { modalActions } from "../../../../redux/modal-slice";
import { doc, increment, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../../../firebase";
import UserIcon from "./UserIcon";
import "./ReplyOrReviseComment.css";

const Keys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
  "Delete",
]);

interface T {
  type: string;
  deepth: number;
  origin_index: number;
  reply_index?: number;
  comment_data: Comment;
  userData: UserData;
}

const ReplyOrReviseComment = ({
  type,
  deepth,
  origin_index,
  reply_index,
  comment_data,
  userData,
}: T) => {
  console.log("Render!!!!!!", type);

  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLAnchorElement | null>(null);
  const { origin_id, createdAt, user_id } = comment_data;
  const comment_id = createdAt + user_id;

  const [tagName] = useState<string | null>(
    comment_data.user_id !== userData.user_id && comment_data.parent_name
      ? "@" + comment_data.user_name
      : null
  );

  const [disabled, setDisabled] = useState<boolean>(
    type.includes("reply") ? false : true
  );

  const [commentText] = useState<string>(comment_data.content.join(""));

  const reviseHandler = async (comment: [string, string, string]) => {
    const reivseDocumentRef = doc(db, "comments", comment_id);

    await updateDoc(reivseDocumentRef, { content: comment, isRevised: true });
    const updatedField: Comment = { ...comment_data };
    updatedField.content = comment;

    if (type === "revise-origin") {
      dispatch(
        originCommentActions.updateComment({ type, origin_index, updatedField })
      );
    }

    if (type === "revise-reply") {
      dispatch(
        replyActions.updateReply({
          origin_id: origin_id!,
          reply_index: reply_index!,
          updatedField,
        })
      );
    }

    if (type === "revise-my") {
      dispatch(
        myReplyActions.updateMyReply({
          origin_id: origin_id!,
          comment_id,
          updatedField,
        })
      );
    }

    dispatch(modalActions.clearModalInfo({ comment_id, type }));
  };

  const replyHandler = async (content: [string, string, string]) => {
    const timestamp: string = new Date(
      Date.now() + 9 * 60 * 60 * 1000
    ).toISOString();

    const batch = writeBatch(db);

    const originId = origin_id || comment_id;
    const document_id = timestamp + user_id;

    const fieldData: Comment = {
      content_type: comment_data.content_type,
      content_id: comment_data.content_id,
      content_title: comment_data.content_title,
      content,
      user_id: userData.user_id,
      user_name: userData.user_name,
      user_photo: userData.user_photo,
      createdAt: timestamp,
      origin_id: originId,
      parent_id: comment_id,
      parent_name: comment_data.user_name,
      like_count: 0,
      dislike_count: 0,
      reply_count: 0,
      isRevised: false,
      emotion: comment_data.emotion,
    };

    const newMyReplyDocumentRef = doc(db, "comments", document_id);

    const originDocumentRef = doc(db, "comments", originId);
    batch.set(newMyReplyDocumentRef, fieldData);
    batch.update(originDocumentRef, { reply_count: increment(1) });
    await batch.commit();

    dispatch(
      myReplyActions.addNewMyReply({
        origin_id: originId,
        comment_id: document_id,
        comment_data: fieldData,
      })
    );
    if (type === "reply-reply") {
      dispatch(
        originCommentActions.updateComment({ origin_index, type: "reply" })
      );
    }
    dispatch(modalActions.clearModalInfo({ comment_id, type }));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData) return alert("로그인 하시면 이용하실 수 있습니다.");

    const content = divRef.current?.innerText;
    if (!content) return alert("댓글을 입력해주세요!");

    function getCustomInnerText(
      element: HTMLDivElement
    ): [string, string, string] {
      let firstText = "";
      let lastText = "";
      let tag = "";
      let isAfterAnchor = false;

      function traverse(node: ChildNode) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (isAfterAnchor) lastText += node.textContent;
          else firstText += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === "SCRIPT") return;

          if (node.nodeName === "BR" && node.nextSibling) {
            if (isAfterAnchor) lastText += "\n";
            else firstText += "\n";
            return;
          }

          const { display, height } = window.getComputedStyle(
            node as HTMLElement
          );

          if (node.previousSibling && display === "block" && height !== "0px") {
            if (isAfterAnchor) lastText += "\n";
            else firstText += "\n";
          }

          if (node === tagRef.current) {
            // node가 tag이면 재귀 탐색을 중단하고 요소의 텍스트를 추가한다.
            isAfterAnchor = true;
            tag = node.textContent || "";
            return;
          }

          // Recursively process child nodes
          node.childNodes.forEach(traverse);

          const nextNode = node.nextSibling;

          if (!nextNode || display !== "block") return;

          if (nextNode.nodeType === Node.TEXT_NODE) {
            if (isAfterAnchor) lastText += "\n";
            else firstText += "\n";
          } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
            const nextStyle = window.getComputedStyle(nextNode as HTMLElement);

            if (nextStyle.height === "0px" || nextStyle.display === "block")
              return;
            if (nextNode.childNodes.length === 0) return;

            if (isAfterAnchor) lastText += "\n";
            else firstText += "\n";
          }
        }
      }

      traverse(element);

      // 텍스트 앞, 뒤 줄바꿈 공백을 삭제한다.
      firstText = firstText.trimStart();
      lastText = lastText.trimEnd();

      return [firstText, tag, lastText];
    }

    const newContent = getCustomInnerText(divRef.current);

    try {
      if (type.includes("revise")) await reviseHandler(newContent);
      else await replyHandler(newContent);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!divRef.current) return;

    const tagClickHandler = (e: MouseEvent) => {
      // tag를 클릭하면 p tag앞으로 텍스트 커서가 이동시킨다.
      e.preventDefault();

      const clickedElement = e.currentTarget as HTMLElement;

      if (clickedElement === tagRef.current) {
        const selection = document.getSelection();
        if (selection?.rangeCount === 0) return;

        // 텍스트 커서를 tag 앞으로 이동
        selection?.collapse(tagRef.current, 0);
      }
    };

    const tagElement = document.createElement("a");

    const array = comment_data.content;

    const setUpTag = (text: string) => {
      tagElement.innerText = text;
      tagElement.addEventListener("mousedown", (e) => tagClickHandler(e));
      tagElement.href = "#";
      tagRef.current = tagElement;
      divRef.current!.appendChild(tagElement);
    };

    if (type.includes("revise")) {
      array.forEach((comment, index) => {
        if (index === 1 && comment.length > 0) setUpTag(comment);

        if (index !== 1 && comment.length > 0) {
          const span = document.createElement("span");
          span.innerText = comment;
          divRef.current!.append(span);
        }
      });
    } else if (type.includes("reply") && tagName) {
      setUpTag(`&nbsp;${tagName}&nbsp;`);
    }

    // `<p>` 뒤에 빈 텍스트 노드 추가
    const range = document.createRange(); // 새로운 Range 객체 생성
    const selection = window.getSelection(); // 현재 Selection 객체 가져오기

    // 자식 요소의 마지막 노드로 커서를 설정
    range.selectNodeContents(divRef.current);
    range.collapse(false); // 범위를 끝으로 설정 (true: 시작, false: 끝)

    // 선택 범위 설정
    selection?.removeAllRanges(); // 기존 선택 범위 제거
    selection?.addRange(range); // 새 범위를 추가

    divRef.current.focus();
  }, [tagName, comment_data, type]);

  return (
    <div
      className="comment-container"
      style={{
        marginLeft: `${deepth * 55}px`,
      }}
    >
      <UserIcon
        user_photo={userData.user_photo}
        user_name={userData.user_name}
      />
      <form className="reply-input-box" onSubmit={submitHandler}>
        <div className="reply-text-box">
          <div
            ref={divRef}
            className="editable"
            contentEditable="true"
            spellCheck="false"
            dir="auto"
            onKeyDown={(e) => {
              if (!Keys.has(e.key)) return;

              const tag = tagRef.current;
              const firstChildTextLength = tag?.firstChild?.textContent?.length;
              const lastChildTextLength = tag?.lastChild?.textContent?.length;

              const selection = document.getSelection();
              if (selection?.rangeCount === 0) return;
              const anchorNode = selection?.anchorNode;

              if (e.key === "Backspace") {
                if (!tag?.contains(selection?.anchorNode!)) return;

                selection?.extend(tag!, 0);
                return;
              }

              if (e.key === "Delete") {
                if (tag?.contains(anchorNode!)) {
                  selection?.extend(tag, tag.childNodes.length);
                  return;
                }

                const prevNode = tag?.previousSibling;
                const prevLastChild = prevNode?.lastChild;
                const anchorOffset = selection?.anchorOffset;

                if (
                  prevNode?.nodeType === Node.TEXT_NODE &&
                  anchorOffset === prevNode.textContent?.length &&
                  prevNode === anchorNode
                ) {
                  selection?.extend(tag!, tag?.childNodes.length);
                  return;
                }

                if (!prevLastChild?.contains(anchorNode!)) return;

                if (prevNode?.nodeType === Node.ELEMENT_NODE) {
                  function getDeepestLastChild(node: Node): Node | undefined {
                    while (node && node.lastChild) {
                      node = node.lastChild;
                    }
                    // 3 => TextNode, 1 => ElementNode
                    if (node.nodeType === 3 || node.nodeType === 1) return node;

                    return undefined;
                  }

                  const deepestLastChild = getDeepestLastChild(prevLastChild!);
                  const textLength = deepestLastChild?.textContent?.length;
                  if (textLength === selection?.anchorOffset)
                    selection?.extend(tag!, tag?.childNodes.length);
                }
                return;
              }

              setTimeout(() => {
                const selection = document.getSelection();
                if (selection?.rangeCount === 0) return;
                const anchorNode = selection!.anchorNode;
                const anchorOffset = selection!.anchorOffset;
                const focusNode = selection!.focusNode;
                const focusOffset = selection!.focusOffset;

                if (!tag?.contains(focusNode)) return;

                if (e.shiftKey) {
                  let directionOfDrag = "";
                  const position = anchorNode!.compareDocumentPosition(
                    focusNode!
                  );

                  if (anchorNode === focusNode) {
                    if (anchorOffset < focusOffset) directionOfDrag = "right";
                    else if (anchorOffset > focusOffset)
                      directionOfDrag = "left";
                  }

                  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                    // anchorNode가 focuseNode 보다 앞에 위치
                    directionOfDrag = "right";
                  } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                    // anchorNode가 focuseNode 보다 뒤에 위치
                    directionOfDrag = "left";
                  }

                  if (e.key === "ArrowRight") {
                    if (directionOfDrag === "left") {
                      // anchor가 focuse 보다 뒤에 있는 상황이고 텍스트 커서가 focus가 tag 영역에 존재
                      selection?.extend(tag, 0);
                      return;
                    }
                    selection?.extend(tag, tag.childNodes.length);
                  } else if (e.key === "ArrowLeft") {
                    if (directionOfDrag === "right") {
                      selection?.extend(tag, tag.childNodes.length);
                      return;
                    }
                    selection?.extend(tag, 0);
                  }

                  if (e.key === "ArrowUp") {
                    if (directionOfDrag === "left") {
                      selection?.extend(tag, 0);
                    } else if (directionOfDrag === "right") {
                      selection?.extend(tag, tag.childNodes.length);
                    }
                  } else if (e.key === "ArrowDown") {
                    if (directionOfDrag === "left") {
                      selection?.extend(tag, 0);
                    } else if (directionOfDrag === "right") {
                      selection?.extend(tag, tag.childNodes.length);
                    }
                  }
                } else {
                  // 단순히 tagRef영역에서 방향키를 누른 경우
                  if (e.key === "ArrowRight")
                    selection?.collapse(tag!, tag.childNodes.length);
                  else if (e.key === "ArrowLeft") {
                    if (anchorOffset < lastChildTextLength!)
                      selection?.collapse(tag, 0);
                  } else if (anchorOffset < firstChildTextLength!) {
                    // up, down, left 키를 누른 경우
                    selection?.collapse(tag!, 0);
                  }
                }
              }, 0);
            }}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              const innerText = target.innerText;
              if (innerText.length === 0) return setDisabled(true);   

              if (innerText !== commentText && disabled) setDisabled(false);

              if (innerText === commentText && !disabled) setDisabled(true);
            }}
          ></div>
          <i />
        </div>
        <div className="reply-button-box">
          <button
            className="enabled"
            type="button"
            onClick={() => {
              dispatch(modalActions.clearModalInfo({ comment_id, type }));
            }}
          >
            취소
          </button>
          <button
            className={disabled ? "disabled" : "enabled"}
            type="submit"
            disabled={disabled}
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyOrReviseComment;
