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
    const input = inputRef.current!.value;

    for (const item of festivalArray) {
      if (item.title.includes(input)) {
        searchArray.push(item);
      }
    }
    dispatch(festivalActions.searchFestival(searchArray));
    navigate(`/search/${input}`);
  };

  return (
    <form className="search-box" onSubmit={onSubmitHandler}>
      <input ref={inputRef} />
      <button>검색</button>
    </form>
  );
};

export default Search;
