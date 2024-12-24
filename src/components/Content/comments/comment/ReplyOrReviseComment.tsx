import React, { useEffect, useRef, useState } from "react";
import { Comment, PickComment, UserData } from "../../../../type/UserDataType";
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
]);

interface T {
  type: string;
  deepth: number;
  originIndex: number;
  replyIndex?: number;
  commentData: Comment;
  userData: UserData;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
  setMyReply: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, Comment>>>
  >;
}

const ReplyOrReviseComment = ({
  type,
  deepth,
  originIndex,
  replyIndex,
  commentData,
  userData,
  setPickedComment,
  setComments,
  setReplyComments,
  setMyReply,
}: T) => {
  console.log("Render!!!!!!");

  const [tag] = useState<string | null>(
    commentData.user_id === userData.user_id
      ? null
      : commentData.parent_name
      ? "@" + commentData.user_name
      : null
  );
  const divRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLAnchorElement | null>(null);

  const reviseHandler = async (comment: [string, string, string]) => {
    const { origin_id, createdAt, user_id } = commentData;

    const document_id = createdAt + user_id;
    const reivseDocumentRef = doc(db, "comments", document_id);

    await updateDoc(reivseDocumentRef, { content: comment, isRevised: true });
    const revisedComment: Comment = { ...commentData };
    revisedComment.content = comment;

    if (type === "revise-origin")
      setComments((prevState) =>
        prevState.map((data, index) =>
          index !== originIndex ? data : revisedComment
        )
      );

    if (type === "revise-to-reply")
      setReplyComments((prevState) => ({
        ...prevState,
        [origin_id!]: prevState[origin_id!].map((data, index) =>
          index !== replyIndex ? data : revisedComment
        ),
      }));

    if (type === "revise-my")
      setMyReply((prevState) => ({
        ...prevState,
        [origin_id!]: {
          ...prevState[origin_id!],
          [document_id]: revisedComment,
        },
      }));
  };

  const replyHandler = async (content: [string, string, string]) => {
    const timestamp: string = new Date(
      Date.now() + 9 * 60 * 60 * 1000
    ).toISOString();

    const batch = writeBatch(db);
    const comment_id =
      type === "reply-origin"
        ? commentData.createdAt + commentData.user_id
        : commentData.origin_id!;

    const fieldData: Comment = {
      content_type: commentData.content_type,
      content_id: commentData.content_id,
      content_title: commentData.content_title,
      content,
      user_id: userData.user_id,
      user_name: userData.user_name,
      user_photo: userData.user_photo,
      createdAt: timestamp,
      origin_id: comment_id,
      parent_id: commentData.user_id,
      parent_name: commentData.user_name,
      like_count: 0,
      dislike_count: 0,
      reply_count: 0,
      isRevised: false,
      emotion: commentData.emotion,
    };

    const newMyReplyDocumentRef = doc(
      db,
      "comments",
      timestamp + commentData.user_id
    );

    const originDocumentRef = doc(db, "comments", comment_id);

    batch.set(newMyReplyDocumentRef, fieldData);
    batch.update(originDocumentRef, { reply_count: increment(1) });
    await batch.commit();

    setMyReply((prevState) => ({
      ...prevState,
      [comment_id]: {
        ...prevState[comment_id],
        [timestamp + commentData.user_id]: fieldData,
      },
    }));
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
            // tag 요소일때, 재귀 탐색을 중단하고 요소의 텍스트를 추가한다.
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
      console.log(firstText + tag + lastText);

      return [firstText, tag, lastText];
    }

    const newContent = getCustomInnerText(divRef.current);

    try {
      if (type.includes("revise")) await reviseHandler(newContent);
      else await replyHandler(newContent);

      setPickedComment((prevState) => {
        const { [commentData.createdAt + commentData.user_id]: _, ...rest } =
          prevState;
        return rest as PickComment;
      });
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!divRef.current) return;

    if (tag) {
      const atag = document.createElement("a");
      atag.innerHTML = `&nbsp;${tag}&nbsp;`;
      atag.href = "#";
      atag.addEventListener("mousedown", (e) => tagClickHandler(e));
      tagRef.current = atag;

      // divRef에 자식노드 ptag 삽입
      divRef.current.appendChild(tagRef.current);
      divRef.current.append("\u00A0");

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
    }
  }, [tag]);

  const tagClickHandler = (e: MouseEvent) => {
    // tag를 클릭하면 p tag앞으로 텍스트 커서가 이동시킨다.
    e.preventDefault();

    const clickedElement = e.currentTarget as HTMLElement;

    if (clickedElement === tagRef.current) {
      const selection = document.getSelection();
      if (selection?.rangeCount === 0) return;
      const range = selection?.getRangeAt(0);

      // 클릭된 태그의 부모에서 범위를 설정
      range!.setStartBefore(clickedElement);
      range!.setEndBefore(clickedElement);
      range!.collapse(true);
      // 선택 범위를 갱신
      selection?.removeAllRanges();
      selection?.addRange(range!);

      // 부모 요소에 포커스 설정
      clickedElement.focus();
    }
  };

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
              const TagTextLength = tag?.textContent?.length || 0;
              const prevNode = tag?.previousSibling;
              const nextNode = tag?.nextSibling;

              setTimeout(() => {
                const selection = document.getSelection();
                if (selection?.rangeCount === 0) return;
                const anchorNode = selection!.anchorNode;
                const anchorOffset = selection!.anchorOffset;
                const focusNode = selection!.focusNode;
                const focusOffset = selection!.focusOffset;

                if (
                  focusNode?.parentNode !== tag &&
                  anchorNode?.parentNode !== tag
                )
                  return;

                // const range = selection!.getRangeAt(0);

                if (e.key === "Backspace") {
                  if (focusOffset > 0 && focusOffset < TagTextLength)
                    tagRef.current?.remove();
                  return;
                }

                if (e.shiftKey) {
                  let directonOfDrag = "";
                  const position = anchorNode!.compareDocumentPosition(
                    focusNode!
                  );

                  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                    // anchorNode가 focuseNode 보다 앞에 위치
                    directonOfDrag = "right";
                  } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                    // anchorNode가 focuseNode 보다 뒤에 위치
                    directonOfDrag = "left";
                  }

                  const extendSelection = (
                    type: string,
                    node: ChildNode | null | undefined
                  ) => {
                    const nodeText = node?.textContent;

                    if (nodeText && nodeText.length > 0)
                      selection?.extend(
                        node!,
                        type === "prev" ? nodeText.length - 1 : 1
                      );
                    else if (nodeText && nodeText.length === 0)
                      selection?.extend(node!, 0);
                    else if (!node) selection?.extend(tag!, 1);
                  };

                  const collapseSelection = (
                    type: string,
                    node: ChildNode | null | undefined
                  ) => {
                    const nodeText = node?.textContent;

                    if (nodeText && nodeText.length > 0)
                      selection?.collapse(
                        node!,
                        type === "prev" ? nodeText.length - 1 : 1
                      );
                    else if (nodeText && nodeText.length === 0)
                      selection?.collapse(node!, 0);
                    else if (!node) selection?.collapse(tag!, 0);
                  };

                  if (e.key === "ArrowRight") {
                    if (directonOfDrag === "left") {
                      // anchor가 focuse 보다 뒤에 있는 상황이고 텍스트 커서가 focus가 tag 영역에 존재
                      extendSelection("prev", prevNode);
                      return;
                    }

                    if (
                      (anchorNode !== prevNode &&
                        anchorNode?.parentNode !== tag) ||
                      anchorNode === prevNode
                    ) {
                      if (focusNode?.parentNode !== tag) return;

                      extendSelection("next", nextNode);
                    }

                    if (anchorNode?.parentNode === tag) {
                      collapseSelection("prev", prevNode);
                      extendSelection("next", nextNode);
                    }
                  } else if (e.key === "ArrowLeft") {
                    if (directonOfDrag === "right") {
                      selection?.collapse(anchorNode, anchorOffset);
                      extendSelection("next", nextNode);
                      return;
                    }

                    if (anchorNode === nextNode) {
                      // 2-(1): nextNode에서 왼쪽 방향으로 출발
                      if (focusNode?.parentNode !== tag) return;
                      extendSelection("prev", prevNode);
                    }

                    if (anchorNode?.parentNode === tag) {
                      // 2-(3): 태그 바로 우측에서 왼쪽 방향으로 출발
                      if (
                        anchorOffset === TagTextLength &&
                        anchorOffset === focusOffset
                      )
                        return;

                      collapseSelection("next", nextNode);
                      extendSelection("prev", prevNode);
                    }

                    if (anchorNode?.parentNode !== tag)
                      extendSelection("prev", prevNode);
                  }

                  if (e.key === "ArrowUp") {
                    if (directonOfDrag === "left") {
                      // anchorNode가 focousNode 보다 뒤에 위치 즉 아래에서 위로
                      if (anchorNode?.parentNode === tag) {
                        collapseSelection("next", nextNode);
                      }

                      if (focusNode?.parentNode === tag) {
                        extendSelection("prev", prevNode);
                      } else selection?.extend(focusNode!, focusOffset);
                    } else if (directonOfDrag === "right") {
                      // anchorNode가 focusNode 보다 앞에 위치 즉 위에서 아래로
                      extendSelection("next", nextNode);
                    }
                  } else if (e.key === "ArrowDown") {
                    if (directonOfDrag === "left") {
                      // anchorNode가 focousNode 보다 뒤에 위치 즉 아래에서 위로
                      extendSelection("prev", prevNode);
                    } else if (directonOfDrag === "right") {
                      // anchorNode가 focusNode 보다 앞에 위치 즉 위에서 아래로
                      extendSelection("next", nextNode);
                    }
                  }
                } else {
                  // 단순히 tagRef영역에서 방향키를 누른 경우
                  if (e.key === "ArrowRight") selection?.collapse(tag!, 1);
                  else if (anchorOffset < TagTextLength) {
                    // up, down, left 키를 누른 경우
                    selection?.collapse(tag!, 0);
                  }
                }
              }, 0);
            }}
          />
          <i />
        </div>
        <div className="reply-button-box">
          <button
            type="button"
            onClick={() => {
              setPickedComment((prevState) => {
                const {
                  [commentData.createdAt + commentData.user_id]: _,
                  ...rest
                } = prevState;
                return rest as PickComment;
              });
            }}
          >
            취소
          </button>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
};

export default ReplyOrReviseComment;
