import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./PcSearch.css";

interface HeaderProps {
  pathname: string;
  scrollY: number;
  mouseOver: boolean;
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const PcSearch = ({
  pathname,
  scrollY,
  mouseOver,
  openSearch,
  setOpenSearch,
}: HeaderProps) => {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    if (!openSearch) return;

    event.preventDefault();
    /* replace()을 해서 input 텍스트의 공백부분을 지워준다.
      이러한 이유는 예를들어, 토요명품 축제를 사용자가 '토요 명품'으로 검색할 시 공백
      때문에 해당축제를 찾지를 못한다..
      /\s+/g=> 정규표현식으로 하나이상의 공백을 뜻한다고 한다.
    */
    let inputText = "";

    inputText = inputRef.current!.value.replace(/\s+/g, "");

    if (inputText.length === 0) {
      return alert("검색 키워드를 입력해주세요!");
    }

    navigate(`/result/${inputText}`);
    inputRef.current!.value = "";
  };

  return (
    <form className="search-box" onSubmit={onSubmitHandler}>
      {openSearch && (
        <>
          <input
            ref={inputRef}
            type="text"
            name="title"
            placeholder="축제를 검색해보세요!"
          />
          <button type={openSearch ? "submit" : "button"}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </>
      )}
      {!openSearch && (
        <button
          className={`${
            pathname === "/" && scrollY === 0 && !mouseOver
              ? "scroll-top-color"
              : "#normal-color"
          }`}
          onClick={() => !openSearch && setOpenSearch(true)}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
          />
        </button>
      )}
    </form>
  );
};

export default PcSearch;
