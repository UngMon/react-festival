import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchUi.css";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* replace()을 해서 input 텍스트의 공백부분을 지워준다.
      이러한 이유는 예를들어, 토요명품 축제를 사용자가 '토요 명품'으로 검색할 시 공백
      때문에 해당축제를 찾지를 못한다..
      /\s+/g=> 정규표현식으로 하나이상의 공백을 뜻한다고 한다.
    */
    let inputText = "";

    if (location.pathname === "/search") {
      inputText = mobileInputRef.current!.value.replace(/\s+/g, "");
    } else {
      inputText = inputRef.current!.value.replace(/\s+/g, "");
    }

    if (inputText.length === 0) {
      return alert("검색 키워드를 입력해주세요!");
    }

    navigate(`/result/${inputText}`);
  };

  return (
    <>
      {
        //pc환경
         (
          <form className="search-box" onSubmit={onSubmitHandler}>
            <input
              ref={inputRef}
              type="text"
              name="title"
              placeholder="찾으시는 축제를 검색해보세요!"
            />
            <button>
              <img src="/images/search.png" alt="검색" width="25"></img>
            </button>
          </form>
        )
      }
      {
        // 모바일 환경
        location.pathname === "/search" && (
          <form className="mobile-search-form" onSubmit={onSubmitHandler}>
            <div>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="검색어를 입력해주세요"
                ref={mobileInputRef}
              />
              <img src="./images/search.png" alt="아이콘" width="25"></img>
            </div>
          </form>
        )
      }
    </>
  );
};

export default Search;
