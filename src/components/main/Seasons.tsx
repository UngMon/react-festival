// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { festivalActions } from "../../redux/festival-slice";
// import { RootState, useAppDispatch } from "../../redux/store";
// import { CurrentSeason } from "../../utils/CurrentSeason";
// import Loading from "../ui/Loading";
// import UiBox from "../ui/UiBox";
// import Card from "../card/Card";

// const Seasons = () => {
//   const dispatch = useAppDispatch();
//   const { seasonKey } = useParams();
//   const [season, setSeason] = useState<string>(seasonKey || CurrentSeason());
//   const festivalState = useSelector((state: RootState) => state.festival);

//   useEffect(() => {
//     //새로고침(마운트)시 리덕스 스테이트 업데이트
//     if (festivalState.successGetData && !festivalState.sortedSeason) {
//       dispatch(festivalActions.sortDataBySeason());
//     }
//   }, [dispatch, festivalState]);

//   return (
//     <main className="main-box">
//       {festivalState.successGetData && (
//         <UiBox category={"season"} season={season} setSeason={setSeason} />
//       )}
//       {!festivalState.sortedSeason && <Loading />}
//       {festivalState.sortedSeason && (
//         <Card type="season" season={season} month="all" />
//       )}
//     </main>
//   );
// };

// export default Seasons;
