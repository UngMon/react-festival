import { LikedComment, LikedContent, CommentType } from "../../type/DataType";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ContentIdCode } from "assets/CatCode/CatCode";

interface T {
  item: CommentType | LikedComment | LikedContent;
  index: number;
  date: string;
  deleteHandler: (
    date: string,
    index: number,
    item: CommentType | LikedComment | LikedContent
  ) => void;
}

const Card = ({ item, index, date, deleteHandler }: T) => {
  const navigate = useNavigate();

  const imageClickHandler = (content_type: string, content_id: string) => {
    navigate(`/content?contentTypeId=${content_type}&contentId=${content_id}`);
  };

  const time = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString("un-es", {
      timeZone: "UTC", // UTC 기준 시간 그대로 출력
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="view-box">
      <div id="v-b-1">
        <h3>{ContentIdCode[item.content_type]}</h3>
        <button type="button" onClick={() => deleteHandler(date, index, item)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div id="v-b-2">
        <div id="v-b-3">
          {"text" in item && <div>{item.text}</div>}
          <div>
            <span>{item.content_title}</span>
            {"like_users" in item && (
              <span>{`에 남긴 ${item.origin_id ? "답글" : "댓글"}`}</span>
            )}
            {"comment_id" in item && (
              <span>{`의 ${item.origin_id ? "답글" : "댓글"}에 반응함`}</span>
            )}
          </div>
          <div>{time(item.createdAt)}</div>
        </div>
        <div
          id="v-b-img"
          onClick={() => imageClickHandler(item.content_type, item.content_id)}
        >
          <img src={item.image_url || "./images/NoImage.png"} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Card;
