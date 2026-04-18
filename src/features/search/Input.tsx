import { 대분류 } from "constant/catCode";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { CheckParams } from "hooks/useCheckParams";
import sub from "assets/search/sub.jpg";
import sub_medium from "assets/search/sub-medium.jpg";
import sub_small from "assets/search/sub-small.jpg";
import "./Input.css";

interface T {
  params: CheckParams;
}

const Input = ({ params }: T) => {
  const { keyword, cat1 } = params;
  const [text, setText] = useState<string | undefined>(keyword);
  const [previousCategory, setPreviousCategory] = useState<string>(cat1!);

  const navigate = useNavigate();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!text && text!.length < 1) return alert("검색어를 입력해주세요!");
    if (text === keyword && cat1 === previousCategory) return;
    navigate(`/search?keyword=${text}&cat1=${cat1}&page=1`);
  };

  const listClickHandler = (category: string) => {
    if (category !== previousCategory) setPreviousCategory(category);
    setText(keyword);
    navigate(`/search?keyword=${keyword}&cat1=${category}&page=1`);
  };

  return (
    <div className="result-search-container">
      <div style={{ position: "relative" }}>
        <picture className="result-page-picture">
          <source srcSet={sub_small} media="(max-width: 600px)" />
          <source srcSet={sub_medium} media="(max-width: 1200px)" />
          <img src={sub} alt="반응형 이미지" />
        </picture>
        <div className="sub">{`${대분류[cat1!]} : ${keyword}`}</div>
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
            <select
              onChange={(e) => {
                listClickHandler(e.target.value);
              }}
            >
              {Object.entries(대분류).map((item) => (
                <option key={item[0]} value={item[0]}>
                  {item[1]}
                </option>
              ))}
            </select>
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
          <ul>
            {Object.entries(대분류).map((item) => (
              <li
                id={cat1 === item[0] ? "check" : ""}
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
