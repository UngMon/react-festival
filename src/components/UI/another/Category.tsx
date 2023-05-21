import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { categoryActions } from "../../../redux/category-slice";

interface T {
  title: string;
  region: string;
  cat1: string;
  cat2: string;
  cat3?: string;
}

const Category = ({ title, region, cat1, cat2, cat3 }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pickerSelector = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string
  ) => {
    const value = event.target.value;

    if (type === "cat1") {
      dispatch(categoryActions.categoryChange({ cat1: value, cat2: 'all', cat3: 'all' }));
      navigate(
        `/${title}/serach?region=${region}&cat1=${value}&cat2=${cat2}&cat3=${cat3}`
      );
    }

    if (type === "cat2") {
      dispatch(categoryActions.categoryChange({ cat1, cat2: value, cat3 }));
      navigate(
        `/${title}/serach?region=${region}&cat1=${cat1}&cat2=${value}&cat3=${cat3}`
      );
    }

    if (type === "cat3") {
      dispatch(categoryActions.categoryChange({ cat1, cat2, cat3: value }));
      navigate(
        `/${title}/serach?region=${region}&cat1=${cat1}&cat2=${cat2}&cat3=${value}`
      );
    }
  };

  return (
    <div id="picker-box">
      {
        // 관광지..
        title === "tour" && (
          <>
            <div className="picker">
              <select value={cat1} onChange={(e) => pickerSelector(e, "cat1")}>
                <option value="all"># 전체(대분류)</option>
                <option value="A01">자연</option>
                <option value="A02">인문(문화/예술/역사)</option>
              </select>
              <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <div className="picker">
              {cat1 === "all" && (
                <select
                  value={cat2}
                  onChange={(e) => pickerSelector(e, "cat2")}
                >
                  <option value="all"># 전체(중분류)</option>
                  <option value="A0101" disabled>
                    # 자연관광지
                  </option>
                  <option value="A0102" disabled>
                    # 관광자원
                  </option>
                  <option value="A0201" disabled>
                    # 역사관광지
                  </option>
                  <option value="A0202" disabled>
                    # 휴양관광지
                  </option>
                  <option value="A0203" disabled>
                    # 체험관광지
                  </option>
                  <option value="A0204" disabled>
                    # 산업관광지
                  </option>
                  <option value="A0205" disabled>
                    # 건축/조형물
                  </option>
                </select>
              )}
              {cat1 === "A01" && (
                <select
                  value={cat2}
                  onChange={(e) => pickerSelector(e, "cat2")}
                >
                  <option value="all"># 전체(자연)</option>
                  <option value="A0101"># 자연관광지</option>
                  <option value="A0102"># 관광자원</option>
                </select>
              )}
              {cat1 === "A02" && (
                <select
                  value={cat2}
                  onChange={(e) => pickerSelector(e, "cat2")}
                >
                  <option value="all"># 전체(인문)</option>
                  <option value="A0201"># 역사관광지</option>
                  <option value="A0202"># 휴양관광지</option>
                  <option value="A0203"># 체험관광지</option>
                  <option value="A0204"># 산업관광지</option>
                  <option value="A0205"># 건축/조형물</option>
                </select>
              )}
              <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </>
        )
      }
      {title === "culture" && (
        <>
          <div className="picker">
            <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
              <option value="A0206"># 문화시설</option>
            </select>
            <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="picker">
            <select value={cat3} onChange={(e) => pickerSelector(e, "cat3")}>
              <option value="A02060100"># 박물관</option>
              <option value="A02060200"># 기념관</option>
              <option value="A02060300"># 전시관</option>
              <option value="A02060400"># 컨벤션센터</option>
              <option value="A02060500"># 미술관/화랑</option>
              <option value="A02060600"># 공연장</option>
              <option value="A02060700"># 문화원</option>
              <option value="A02060800"># 외국문화원</option>
              <option value="A02060900"># 도서관</option>
              <option value="A02061000"># 대형서점</option>
              <option value="A02061100"># 문화전수시설</option>
              <option value="A02061200"># 영화관</option>
              <option value="A02061300"># 어학당</option>
              <option value="A02061300"># 학교</option>
            </select>
            <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </>
      )}
      {title === "travel" && (
        <>
          <div className="picker">
            <select value={cat1} onChange={(e) => pickerSelector(e, "cat1")}>
              <option value="all">#인문(문화/예술/역사)</option>
            </select>
            <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
