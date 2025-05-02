import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./Search.css";

interface HeaderProps {
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const Category: Array<[string, string]> = [
  ["0", "전체"],
  ["12", "관광지"],
  ["14", "문화시설"],
  ["15", "축제"],
  ["25", "여행코스"],
  ["28", "레포츠"],
];
//{ openSearch, setOpenSearch }: HeaderProps
const Search = () => {
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openKeyword, setOpenKeyWord] = useState<boolean>(false);
  const [category, setCategory] = useState<[string, string]>(["0", "전체"]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSearch(false);
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  });

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = inputRef.current!.value;

    if (keyword.length === 0) return alert("검색어를 입력해주세요!");
    // console.log(keyword, category[0]);
    navigate(`/search?keyword=${keyword}&contentTypeId=${category[0]}`);
    inputRef.current!.value = "";
    setOpenSearch(false);
  };

  return (
    <>
      <button
        className="magnifying"
        onClick={() => {
          console.log("clickHere");
          setOpenSearch(true);
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      {openSearch && (
        <div className="search-container">
          <div className="search-box">
            <form onSubmit={onSubmitHandler}>
              <div className="search-input-box">
                <div
                  className={`search-category ${
                    openKeyword ? "category-open" : "category-off"
                  }`}
                  onClick={() => setOpenKeyWord(!openKeyword)}
                >
                  <div className="category">{category[1]}</div>
                  <ul>
                    {Category.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          display: category[0] === item[0] ? "none" : "",
                        }}
                        onClick={() => setCategory([...item])}
                      >
                        {item[1]}
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{ transform: openKeyword ? "rotate(180deg)" : "" }}
                  >
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                </div>
                <label htmlFor="전체검색"></label>
                <input
                  type="text"
                  name="전체검색"
                  placeholder="검색어를 입력해주세요!"
                  autoComplete="off"
                  ref={inputRef}
                />
                <button id="search" type="submit">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
              <button
                id="cancel"
                type="button"
                onClick={() => setOpenSearch(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
