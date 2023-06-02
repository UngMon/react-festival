import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Search.css";

interface HeaderProps {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  setOpenSearch: (value: boolean) => void;
}

const titl: { [key: string]: string } = {
  tour: "관광",
  culture: "문화",
  festival: "축제",
  travel: "여행",
};

const Search = ({ pathname, setOpenSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(titl[pathname.split("/")[1]] || '전체');
  const [openKeyword, setOpenKeyWord] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

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

    const obj: { [key: string]: string } = {
      전체: "0",
      관광: "12",
      문화: "14",
      축제: "15",
      여행: "25",
    };
    console.log(title);
    console.log(obj[title]);
    navigate(
      `/result/search?title=${title}&type=${obj[title]}&keyword=${keyword}`
    );
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
            <span>{title}</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                transform: openKeyword ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
            {openKeyword && (
              <ul>
                <li onClick={() => setTitle("전체")}>전체</li>
                <li onClick={() => setTitle("관광")}>관광지</li>
                <li onClick={() => setTitle("문화")}>문화시설</li>
                <li onClick={() => setTitle("축제")}>축제</li>
                <li onClick={() => setTitle("여행")}>여행코스</li>
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
