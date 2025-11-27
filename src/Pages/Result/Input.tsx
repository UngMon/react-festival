import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { CheckParams } from "hooks/useCheckParams";
import { ContentIdCode } from "assets/CatCode/CatCode";
import "./Input.css";

interface T {
  params: CheckParams;
}

const Input = ({ params }: T) => {
  const { contentTypeId, keyword } = params;
  const [text, setText] = useState<string | undefined>(keyword);
  const [contentType, setContentType] = useState<string>(contentTypeId!);

  const navigate = useNavigate();
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!text && text!.length < 1) return alert("검색어를 입력해주세요!");
    if (text === keyword && contentTypeId === contentType) return;
    navigate(`/search?contentTypeId=${contentTypeId}&keyword=${text}`);
  };

  const listClickHandler = (tpye_num: string) => {
    setContentType(tpye_num);
    navigate(`/search?keyword=${text}&contentTypeId=${tpye_num}`);
  };

  return (
    <div className="result-search-container">
      <div style={{ position: "relative" }}>
        <picture className="result-page-picture">
          <source srcSet="./images/sub-small.jpg" media="(max-width: 600px)" />
          <source
            srcSet="./images/sub-medium.jpg"
            media="(max-width: 1200px)"
          />
          <img src="./images/sub.jpg" alt="반응형 이미지" />
        </picture>
        <div className="sub">{`${ContentIdCode[contentType]} : ${keyword}`}</div>
      </div>
      <div
        style={{
          position: "relative",
          margin: "30px auto 0",
          width: "clamp(280px, 87.5%, 800px)",
        }}
      >
        <strong>원하시는 검색어를 입력하신 후 검색 버튼을 클릭하세요.</strong>
        <form onSubmit={submitHandler}>
          <fieldset className="result-search-box">
            <legend>개인 정보</legend>
            <label htmlFor="text" />
            <input
              type="text"
              id="text"
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button id="serach-icon" type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </fieldset>
        </form>
        <div id="type-box">
          <div id="type-select-box">
            <select onChange={(e) => listClickHandler(e.target.value)}>
              {Object.entries(ContentIdCode).map((item) => (
                <option
                  key={item[0]}
                  value={item[0]}
                  selected={
                    item[1] === ContentIdCode[contentTypeId!] ? true : false
                  }
                >
                  {item[1]}
                </option>
              ))}
            </select>
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
          <ul>
            {Object.entries(ContentIdCode).map((item) => (
              <li
                id={contentTypeId === item[0] ? "check" : ""}
                key={item[0]}
                onClick={() => listClickHandler(item[0])}
              >
                {item[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Input;
