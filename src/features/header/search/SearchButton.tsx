import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faAngleDown,
//   faMagnifyingGlass,
// } from "@fortawesome/free-solid-svg-icons";
import "./SearchButton.css";

const Category: Array<[string, string]> = [
  ["0", "전체"],
  ["12", "관광지"],
  ["14", "문화시설"],
  ["15", "축제"],
  ["25", "여행코스"],
  ["28", "레포츠"],
];

interface T {
  openSearch: boolean;
  setOpenSearch: (bool: boolean) => void;
}

const SearchButton = ({ openSearch, setOpenSearch }: T) => {
  const navigate = useNavigate();
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
    navigate(`/search?keyword=${keyword}&cat1=all&page=1`);
    inputRef.current!.value = "";
    setOpenSearch(false);
  };

  return (
    <>
      <button className="magnifying" onClick={() => setOpenSearch(true)}>
        <span className="material-symbols-outlined">search</span>
      </button>
      {openSearch && (
        <div className="search-container">
          <div className="search-box">
            <form onSubmit={onSubmitHandler} id="전체검색">
              <div className="search-input-box">
                <label htmlFor="전체검색"></label>
                <input
                  type="text"
                  name="전체검색"
                  placeholder="검색어를 입력해주세요!"
                  autoComplete="off"
                  ref={inputRef}
                />
                <button id="magnifying" type="submit">
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
              <button
                id="cancel"
                type="button"
                onClick={() => setOpenSearch(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchButton;
