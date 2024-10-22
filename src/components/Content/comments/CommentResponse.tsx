import { Comment, PickComment, UserData } from "../../../type/UserDataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";

interface T {
  // originIndex: number;
  // replyIndex: number;
  item: Comment;
  userData: UserData;
  setPickedComment: React.Dispatch<React.SetStateAction<PickComment>>;
}

// 스타일 객체 정의
const submenuStyle: React.CSSProperties = {
  display: "flex",
  marginTop: "8px",
  height: "28px",
  justifyContent: "left",
  alignItems: "center",
  gridColumnStart: 1,
  gridColumnEnd: 3,
};

const buttonStyle: React.CSSProperties = {
  color: "#434343",
  height: "100%",
  minWidth: "30px",
  cursor: "pointer",
  textAlign: "left",
  marginRight: "10px",
};

const dislikeStyle: React.CSSProperties = {
  ...buttonStyle,
  paddingTop: "5px",
};

const svgStyle: React.CSSProperties = {
  overflow: "hidden",
  fontSize: "18px",
};

const rotatedSvgStyle: React.CSSProperties = {
  ...svgStyle,
  paddingBottom: "2px",
};

const spanStyle: React.CSSProperties = {
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 600,
};

const CommentResponse = ({
  // originIndex,
  // replyIndex,
  item,
  userData,
  setPickedComment,
}: T) => {
  const feelClickHandler = (type: string) => {};

  const replyHandler = () => {
    if (!userData.loginedUser || !userData.userUid)
      return alert("로그인 하시면 이용하실 수 있습니다.");
    setPickedComment((prevState) => ({
      ...prevState,
      [`${item.createdAt}${item.uid}`]: "reply",
    }));
  };

  return (
    <div style={submenuStyle}>
      <button
        onClick={() => feelClickHandler("like")}
        type="button"
        style={buttonStyle}
      >
        <FontAwesomeIcon icon={faThumbsUp} style={svgStyle} />
      </button>
      {item.like_count > 0 && <span style={spanStyle}>{item.like_count}</span>}
      <button
        type="button"
        onClick={() => feelClickHandler("disLike")}
        style={dislikeStyle}
      >
        <FontAwesomeIcon icon={faThumbsDown} style={rotatedSvgStyle} />
      </button>
      {item.disLike_count > 0 && (
        <span style={spanStyle}>{item.disLike_count}</span>
      )}
      <button type="button" onClick={replyHandler} style={buttonStyle}>
        <span style={spanStyle}>답글</span>
      </button>
    </div>
  );
};

export default CommentResponse;
