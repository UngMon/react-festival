import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { TitleEnglishName } from "../../type/FetchType";

interface T {
  title: string;
  month?: string;
  contentTypeId: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3?: string;
}

const Category = ({
  title,
  month,
  contentTypeId,
  areaCode,
  cat1,
  cat2,
  cat3,
}: T) => {
  const navigate = useNavigate();

  const pickerSelector = (
    event: React.ChangeEvent<HTMLSelectElement>,
    cat: string
  ) => {
    const value = event.target.value;

    if (cat === "cat1") {
      navigate(
        `/${title}?contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${value}&cat2=all&cat3=all`
      );
    }

    if (cat === "cat2") {
      navigate(
        `/${title}?${
          title === "축제/공연/행사" ? `month=${month}&` : ""
        }contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${cat1}&cat2=${value}&cat3=all`
      );
    }

    if (cat === "cat3") {
      navigate(
        `/${title}?contentTypeId=${contentTypeId}&areaCode=${areaCode}&cat1=${cat1}&cat2=${cat2}&cat3=${value}`
      );
    }
  };

  return (
    <>
      {title === "관광지" && (
        <>
          <div className="picker">
            <select value={cat1} onChange={(e) => pickerSelector(e, "cat1")}>
              <option value="all"># 전체</option>
              <option value="A01"># 자연</option>
              <option value="A02"># 문화/예술/역사</option>
            </select>
            <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
            <FontAwesomeIcon icon={faCheck} />
          </div>
          {cat1 === "A01" && (
            <div className="picker">
              <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
                <option value="all"># 전체(자연)</option>
                <option value="A0101"># 자연관광지</option>
                <option value="A0102"># 관광자원</option>
              </select>
              <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
              <FontAwesomeIcon icon={faCheck} />
            </div>
          )}
          {cat1 === "A02" && (
            <div className="picker">
              <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
                <option value="all"># 전체(인문)</option>
                <option value="A0201"># 역사관광지</option>
                <option value="A0202"># 휴양관광지</option>
                <option value="A0203"># 체험관광지</option>
                <option value="A0204"># 산업관광지</option>
                <option value="A0205"># 건축/조형물</option>
              </select>
              <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
              <FontAwesomeIcon icon={faCheck} />
            </div>
          )}
        </>
      )}
      {title === "문화시설" && (
        <div className="picker">
          <select value={cat3} onChange={(e) => pickerSelector(e, "cat3")}>
            <option value="all"># 전체</option>
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
      )}
      {title === "여행코스" && (
        <div className="picker">
          <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
            <option value="all"># 전체</option>
            <option value="C0112"># 가족코스</option>
            <option value="C0113"># 나홀로코스</option>
            <option value="C0114"># 힐링코스</option>
            <option value="C0115"># 도보코스</option>
            <option value="C0116"># 캠핑코스</option>
            <option value="C0117"># 맛코스</option>
          </select>
          <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
      {title === "레포츠" && (
        <div className="picker">
          <select value={cat2} onChange={(e) => pickerSelector(e, "cat2")}>
            <option value="all"># 전체</option>
            <option value="A0301"># 레포츠소개</option>
            <option value="A0302"># 육상 레포츠</option>
            <option value="A0303"># 수상 레포츠</option>
            <option value="A0304"># 항공 레포츠</option>
            <option value="A0305"># 복합 레포츠</option>
          </select>
          <FontAwesomeIcon id="before-icon" icon={faFolderOpen} />
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
    </>
  );
};

export default Category;
