import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Search.css";

interface HeaderProps {
  setOpenSearch: (value: boolean) => void;
}

const obj: { [key: string]: string } = {
  "0": "전체",
  "12": "관광",
  "14": "문화",
  "15": "축제",
  "25": "여행",
};

const Search = ({ setOpenSearch }: HeaderProps) => {
  const navigate = useNavigate();
  // 아래 2줄 수정바람.
  const [params] = useSearchParams();
  const [type, setType] = useState<string>(params.get("type") || "0");
  const [openKeyword, setOpenKeyWord] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSearch(false);
    };

    window.addEventListener("keydown", keyDown);

    return window.removeEventListener("keydown", keyDown);
  });

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* replace()을 해서 input 텍스트의 공백부분을 지워준다.
      이러한 이유는 예를들어, 토요명품 축제를 사용자가 '토요 명품'으로 검색할 시 공백
      때문에 해당축제를 찾지를 못한다..
      /\s+/g=> 정규표현식으로 하나이상의 공백을 뜻한다고 한다.
    */

    const keyword = inputRef.current!.value.replace(/\s+/g, "");

    if (keyword.length === 0) {
      return alert("검색 키워드를 입력해주세요!");
    }
    console.log('serach working')
    navigate(`/result?type=${type}&areaCode=0&keyword=${keyword}`);
    inputRef.current!.value = "";
    setOpenSearch(false);
  };

  return (
    <div className="search-box">
      <form className="search-form" onSubmit={onSubmitHandler}>
        <button id="cancel" type="button" onClick={() => setOpenSearch(false)}>
          <FontAwesomeIcon
            icon={faXmark}
            className={openKeyword ? "arrow-actvie" : ""}
          />
        </button>
        <div className="saerch-div">
          <div
            className="search-option-box"
            onClick={() => setOpenKeyWord(!openKeyword)}
          >
            <span>{obj[type]}</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                transform: openKeyword ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
            {openKeyword && (
              <ul>
                <li onClick={() => setType("0")}>전체</li>
                <li onClick={() => setType("12")}>관광지</li>
                <li onClick={() => setType("14")}>문화시설</li>
                <li onClick={() => setType("15")}>축제</li>
                <li onClick={() => setType("25")}>여행코스</li>
              </ul>
            )}
          </div>
          <label htmlFor="전체검색"></label>
          <input
            type="text"
            name="전체검색"
            placeholder="검색어를 입력해주세요!"
            ref={inputRef}
          />
          <button type="submit" id="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
