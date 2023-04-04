import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { Item } from "../../modules/Type";
import { festivalActions } from "../../redux/festival-slice";
import { useNavigate } from "react-router-dom";
import "./SearchUi.css";

const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const festivalArray = useSelector(
    (state: RootState) => state.festival.festivalArray
  );

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchArray: Item[] = [];
    /* trim()을 해서 input 텍스트의 공백부분을 지워준다.
      이러한 이유는 예를들어, 토요명품 축제를 사용자가 '토요 명품'으로 검색할 시 공백
      때문에 해당축제를 찾지를 못한다..
      /\s+/g=> 정규표현식으로 하나이상의 공백을 뜻한다고 한다.
    */
    const input = inputRef.current!.value.replace(/\s+/g, '');

    for (const item of festivalArray) {
      const title = item.title.replace(/\s+/g, '');
      if (title.includes(input)) {
        searchArray.push(item);
      }
    }
    dispatch(festivalActions.searchFestival(searchArray));
    navigate(`/result/${input}`);
  };

  return (
    <form className="search-box" onSubmit={onSubmitHandler}>
      <input ref={inputRef} placeholder='찾으시는 축제를 검색해보세요!'/>
      <button>검색</button>
    </form>
  );
};

export default Search;
