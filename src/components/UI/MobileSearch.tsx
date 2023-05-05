import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./MobileSearch.css";

const MobileSearch = () => {
  const navigate = useNavigate();
  const mobileInputRef = useRef<HTMLInputElement>(null);
  console.log("mobile");

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* replace()을 해서 input 텍스트의 공백부분을 지워준다.
      이러한 이유는 예를들어, 토요명품 축제를 사용자가 '토요 명품'으로 검색할 시 공백
      때문에 해당축제를 찾지를 못한다..
      /\s+/g=> 정규표현식으로 하나이상의 공백을 뜻한다고 한다.
    */
    let inputText = "";

    inputText = mobileInputRef.current!.value.replace(/\s+/g, "");

    if (inputText.length === 0) {
      return alert("검색 키워드를 입력해주세요!");
    }

    navigate(`/result/${inputText}`);
    mobileInputRef.current!.value = "";
  };

  return (
    <>
      {window.innerWidth < 769 && (
        <form className="mobile-search-form" onSubmit={onSubmitHandler}>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="검색어를 입력해주세요"
            ref={mobileInputRef}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </form>
      )}
      {window.innerWidth > 768 && (
        <div className="text-1">
          <p>모바일 전용 페이지 입니다.</p>
        </div>
      )}
    </>
  );
};

export default MobileSearch;
