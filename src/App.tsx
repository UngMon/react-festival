import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { getFestiavalData, getFriebaseImageData } from "./redux/fetch-action";
import { RootState, useAppDispatch } from "./redux/store";
import { useSelector } from "react-redux";
import StartPage from "./Pages/Start";
import LoginPage from "./Pages/Login";
import RootLayout from "./Pages/Root";
import RegionPage from "./Pages/Regions";
import SeasonPage from "./Pages/Seasons";
import AllFestivalPage from "./Pages/AllFestival";
import Regions from "./components/main/Regions";
import Seasons from "./components/main/Seasons";
import Content, { loader as contentLoader } from "./components/Content/Content";
import AllView from "./components/main/AllView";
import ResultPage from "./Pages/Result";
import SearchPage from "./Pages/SearchPage";
import Oauth from "./components/Login/Oauth";
import "./App.css";
// import { collection, getDocs, query } from "firebase/firestore";
// import { db } from "./firebase/firestore";

function App() {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  if (!festivalState.successGetData) {
    console.log('hihihihihihi')
  }

  // const getData = async () => {
  //   const querySnapshot = await getDocs(query(collection(db, "contentId")));
  //   console.log(querySnapshot.docs);
  //   console.log(querySnapshot.forEach((doc) => console.log(doc)));
  // };
  // console.log(getData());

  if (festivalState.successGetData) {
    // 새로고침시에 불 필요한 thunkAction을 줄이기 위함.
    sessionStorage.setItem(
      "festivalArray",
      JSON.stringify(festivalState.festivalArray)
    );
  }

  useEffect(() => {
    if (!sessionStorage.getItem("festivalArray")) {
      console.log("fetchThunk");
      dispatch(getFestiavalData());
    }
    dispatch(getFriebaseImageData());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <StartPage /> },
        {
          path: "all-festival/month",
          element: <AllFestivalPage />,
          children: [
            {
              path: ":monthKey",
              element: <AllView />,
            },
          ],
        },
        {
          path: "regions/areacode",
          element: <RegionPage />,
          children: [{ path: ":regionKey", element: <Regions /> }],
        },
        {
          path: "seasons",
          element: <SeasonPage />,
          children: [{ path: ":seasonKey", element: <Seasons /> }],
        },
        {
          path: "search",
          element: <SearchPage />,
        },
        {
          path: "result",
          children: [{ path: ":keyword", element: <ResultPage /> }],
        },
        {
          path: "content",

          children: [
            {
              path: ":contentId",
              loader: contentLoader,
              element: <Content />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
      children: [
        {
          path: "oauth",
          element: <Oauth />,
        },
      ],
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
