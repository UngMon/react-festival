import { Item } from "../../type/Common";
import { calculateDate } from "../../utils/CalculateDate";
import { nowDate } from "../../utils/NowDate";
import { dataSlice } from "../../utils/DataSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Props {
  month: string;
  areaCode: string;
  cat2: string;
  cat3: string;
}

const FestivalCard = (props: Props) => {
  const state = useSelector((state: RootState) => state.festival);

  const { year, month, date } = nowDate();
  let array: Item[] = [];
  let 행사종료: JSX.Element[] = [];
  let 행사중: JSX.Element[] = [];
  let 행사시작전: JSX.Element[] = [];

  // if (props.areaCode === "0") {
  //   //O(1)
  //   array = state.monthArray[state.month!];
  // } else {
  //   //O(n)
  //   array = state.monthArray[state.month!].filter(
  //     (item) => item.areacode === state.areaCode
  //   );
  // }

  // for (let item of array) {
  //   if (state.cat2 !== "all" && item.cat2 !== state.cat2) continue;

  //   if (state.cat3 !== "all") {
  //     if (item.cat3 !== state.cat3) continue;
  //   }

  //   const 행사상태 = calculateDate(
  //     item.eventstartdate!,
  //     item.eventenddate!,
  //     year,
  //     month,
  //     date
  //   );

  //   if (행사상태 === "진행중") {
  //     if (!행사상태[0]) continue;
  //   } else if (행사상태 === "행사종료") {
  //     if (!행사상태[2]) continue;
  //   } else {
  //     if (!행사상태[1]) continue;
  //   }

  //   let firstImage = item.firstimage;
  //   let imageUri = "";

  //   if (firstImage) {
  //     // 관광공사에서 제공하는 이미지 url이 하필 http....
  //     firstImage = firstImage.replace("http", "https");
  //   }

  //   if (param.contentData[item.contentid]) {
  //     // firebase storage에 저장된 이미지를 사용할 경우..
  //     // 그런데 이 방법은 좋기는 하나 이미지 저작권 문제를 피할 수 없음...
  //     imageUri = param.contentData[item.contentid].firstImage;
  //   }

  //   const element = (
  //     <div
  //       className="festival-item"
  //       key={item.title}
  //       // onClick={() => cardClickHandler(item.contentid)}
  //     >
  //       <div className="image-box">
  //         <img
  //           className="festival-image"
  //           src={firstImage || imageUri || "/images/NoImage.png"}
  //           alt={item.title}
  //           loading={"lazy"}
  //         ></img>
  //       </div>
  //       <p
  //         className={`cal-date ${
  //           행사상태 === "진행중"
  //             ? "ing"
  //             : 행사상태 === "행사종료"
  //             ? "end"
  //             : "aft"
  //         }`}
  //       >
  //         {행사상태}
  //       </p>
  //       <div className="festival-text">
  //         <h3 className="prevent-overflow">{item.title}</h3>
  //         <p className="festival-date">
  //           {dataSlice(item.eventstartdate!, item.eventenddate!)}
  //         </p>
  //       </div>
  //     </div>
  //   );

  //   if (행사상태 === "행사종료") {
  //     행사종료.push(element);
  //     continue;
  //   } else if (행사상태 === "진행중") {
  //     행사중.push(element);
  //     continue;
  //   } else {
  //     행사시작전.push(element);
  //   }
  // }
  // return [...행사중, ...행사시작전, ...행사종료];
};

export default FestivalCard;