import React, { useState } from "react";
import {
  Comment,
  Report,
  UserData,
  PickComment,
} from "../../../type/UserDataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import UserIcon from "./UserIcon";
import CommentResponse from "./CommentResponse";
import OptionModal from "./modal/OptionModal";
import ReplyOrReviseComment from "./ReplyOrReviseComment";
import "./UserComment.css";

interface T {
  index: number;
  item: Comment;
  userData: UserData;
  pickedComment: PickComment;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  clickedElement: React.MutableRefObject<HTMLDivElement | null>;
  setReportModal: React.Dispatch<React.SetStateAction<Report>>;
  setReplyComments: React.Dispatch<
    React.SetStateAction<Record<string, Comment[]>>
  >;
}

const UserComment = ({
  index,
  item,
  userData,
  pickedComment,
  setPickedComment,
  clickedElement,
  setComments,
  setReportModal,
  setReplyComments,
}: T) => {
  const [scrollY, setScrollY] = useState<number>(0);

  const optionClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickedElement.current?.contains(e.target as Node)) {
      // 사용자가 전에 클릭했던 Element('review-option')와 같은 옵션 아이콘을 클릭했을 시,
      clickedElement.current = null;
      setPickedComment((prevState) => ({
        ...prevState, // 기존 속성 유지
        open: "", // open 키 업데이트
      }));
    } else {
      // 다른 태그('review-option')를 클릭했을 시,
      clickedElement.current = e.target as HTMLDivElement;
      setPickedComment((prevState) => ({
        ...prevState, // 기존 속성 유지
        open: item.createdAt + item.uid, // open 키 업데이트
      }));
    }
    setScrollY(window.scrollY);
  };

  return (
    <>
      {pickedComment[item.createdAt + item.uid] !== "revise" ? (
        <div
          className="comment-container"
          style={{
            marginLeft: item.originUid ? "65px" : "",
            width: item.originUid ? "calc(100% - 100px)" : "",
          }}
        >
          <UserIcon userPhoto={item.userPhoto} userName={item.name} />
          <div className="top">
            <span className="name">{item.name}</span>
            {item.isRevised && (
              <span className="revi">&nbsp;&nbsp;(수정됨)</span>
            )}
            <FontAwesomeIcon
              className="comment-option"
              onClick={(event) => optionClickHandler(event)}
              icon={faEllipsisVertical}
            />
          </div>
          <div className="comment-text">
            <span style={{ whiteSpace: "pre-wrap" }}>{item.content}</span>
          </div>
          <CommentResponse
            item={item}
            userData={userData}
            setPickedComment={setPickedComment}
          />
          {pickedComment.open === item.createdAt + item.uid && (
            <OptionModal
              item={item}
              userUid={userData.userUid}
              scrollY={scrollY}
              setScrollY={setScrollY}
              setReportModal={setReportModal}
              setPickedComment={setPickedComment}
              clickedElement={clickedElement}
            />
          )}
        </div>
      ) : (
        <ReplyOrReviseComment
          index={index}
          originData={item}
          userData={userData}
          isRevise={true}
          setComments={setComments}
          setPickedComment={setPickedComment}
          setReplyComments={setReplyComments}
        />
      )}
    </>
  );
};

export default UserComment;
