import { useNavigate } from "react-router-dom";
import "./Tags.css";

interface T {
  title: string;
  month: string;
  areaCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
}

const categoryObject: { [key: string]: string[][] } = {
  A0101: [
    ["전체", "all"],
    ["국립공원", "A01010100"],
    ["도립공원", "A01010200"],
    ["군립공원", "A01010300"],
    ["산", "A01010400"],
    ["자연생태관광지", "A01010500"],
    ["자연휴양림", "A01010600"],
    ["수목원", "A01010700"],
    ["폭포", "A01010800"],
    ["계곡", "A01010900"],
    ["약수터", "A01011000"],
    ["해안절경", "A01011100"],
    ["해수욕장", "A01011200"],
    ["섬", "A01011300"],
    ["항구/포구", "A01011400"],
    ["등대", "A01011600"],
    ["호수", "A01011700"],
    ["강", "A01011800"],
    ["동굴", "A01011900"],
  ],
  A0102: [
    ["전체", "all"],
    ["희귀 동식물", "A01020100"],
    ["기암괴석", "A01020200"],
  ],
  A0201: [
    ["전체", "all"],
    ["고궁", "A02010100"],
    ["성", "A02010200"],
    ["문", "A02010300"],
    ["고택", "A02010400"],
    ["생가", "A02010500"],
    ["민속마을", "A0200600"],
    ["유적지/사적지", "A02010700"],
    ["사찰", "A02010800"],
    ["종교성지", "A02010900"],
    ["안보관광", "A02011000"],
  ],
  A0202: [
    ["전체", "all"],
    ["관광단지", "A02020200"],
    ["온천/욕장/스파", "A02020300"],
    ["이색찜질방", "A02020400"],
    ["헬스투어", "A02020500"],
    ["테마공원", "A02020600"],
    ["공원", "A02020700"],
    ["유람선/잠수함관광", "A02020800"],
  ],
  A0203: [
    ["전체", "all"],
    ["농어촌체험", "A02030100"],
    ["전통체험", "A02030200"],
    ["산사체험", "A02030300"],
    ["이색체험", "A02030400"],
    ["이색거리", "A02030600"],
  ],
  A0204: [
    ["전체", "all"],
    ["발전소", "A02040400"],
    ["식음료", "A02040600"],
    ["기타", "A02040800"],
    ["전자 반도체", "A02040900"],
    ["자동차", "A02041000"],
  ],
  A0205: [
    ["전체", "all"],
    ["다리/대교", "A02050100"],
    ["기념탑/기념비/전망대", "A02050200"],
    ["분수분수분수", "A02050300"],
    ["동상", "A02050400"],
    ["터널", "A02050500"],
    ["유명건물", "A02050600"],
  ],
  A0207: [
    ["전체", "all"],
    ["문화관광축제", "A02070100"],
    ["일반축제", "A02070200"],
  ],
  A0208: [
    ["전체", "all"],
    ["전통공연", "A02080100"],
    ["연극", "A02080200"],
    ["뮤지컬", "A02080300"],
    ["오페라", "A02080400"],
    ["전시회", "A02080500"],
    ["박람회", "A02080600"],
    ["무용", "A02080800"],
    ["클래식음악회", "A02080900"],
    ["대중콘서트", "A02081000"],
    ["영화", "A02081100"],
    ["스포츠경기", "A02081200"],
    ["기타행사", "A02081300"],
  ],
};

const Tags = ({ title, month, areaCode, cat1, cat2, cat3 }: T) => {
  const navigate = useNavigate();

  const festivalTagClick = (value: string) => {
    navigate(
      `/${title}/search?${
        title === "festival" ? `month=${month}&` : ""
      }areaCode=${areaCode}&cat1=${cat1}&cat2=${cat2}&cat3=${value}`
    );
  };

  // const scrollRef = useRef<HTMLDivElement>(null);
  // const [isDrag, setIsDrag] = useState(false);
  // const [startX, setStartX] = useState<number>(0);
  // console.log("??????");
  // const onDragStart = (e: MouseEvent) => {
  //   e.preventDefault();
  //   setIsDrag(true);
  //   setStartX(e.pageX + scrollRef.current!.scrollLeft);
  // };

  // const onDragEnd = (e: MouseEvent) => {
  //   setIsDrag(false);
  // };

  // const onDragMove = (e: MouseEvent) => {
  //   if (isDrag) {
  //     const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current!;

  //     scrollRef.current!.scrollLeft = startX - e.pageX;

  //     if (scrollLeft === 0) {
  //       setStartX(e.pageX);
  //     } else if (scrollWidth <= clientWidth + scrollLeft) {
  //       setStartX(e.pageX + scrollLeft);
  //     }
  //   }
  // };

  // const throttle = (onDragMove: (e: MouseEvent) => void, ms: number) => {
  //   let throttled = false;
  //   return (e: MouseEvent) => {
  //     if (!throttled) {
  //       throttled = true;
  //       setTimeout(() => {
  //         onDragMove(e);
  //         throttled = false;
  //       }, ms);
  //     }
  //   };
  // };
  // const delay = 80;
  // const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <div className="tags">
      <div className="hash">
        {cat2 !== "all" &&
          categoryObject[`${cat2}`].map((item, index) => (
            <button
              key={index}
              className={`${cat3 === item[1] ? "category-active" : "null"}`}
              onClick={() => festivalTagClick(item[1])}
            >
              {item[0]}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Tags;
