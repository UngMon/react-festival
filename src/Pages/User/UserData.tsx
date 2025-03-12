import { LikedComment, LikedContent, Comment } from "../../type/DataType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ContentIdCode } from "../../type/FetchType";

interface T {
  item: Comment | LikedComment | LikedContent;
  index: number;
  date: string;
  convertText?: (content: [string, string, string]) => string;
  imageClickHandler: (cotent_type: string, content_id: string) => void;
  deleteHandler: (
    date: string,
    index: number,
    item: Comment | LikedComment | LikedContent
  ) => void;
  time: (createdAt: string) => string;
}

const UserData = ({
  item,
  index,
  date,
  convertText,
  imageClickHandler,
  time,
  deleteHandler,
}: T) => {
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
          {"content" in item && <div>{convertText!(item.content)}</div>}
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

export default UserData;
