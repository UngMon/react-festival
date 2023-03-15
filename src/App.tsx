import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { fetchFromData } from "./redux/fetch-action";
import { RootState, useAppDispatch } from "./redux/store";
import { useSelector } from "react-redux";
import { festivalActions } from "./redux/festival-slice";
import StartPage from "./Pages/Start";
import LoginPage from "./Pages/Login";
import RootLayout from "./Pages/Root";
import RegionPage from "./Pages/Regions";
import SeasonPage from "./Pages/Seasons";
import AllFestivalPage from "./Pages/AllFestival";
import Regions from "./components/main/Regions";
import Seasons from "./components/main/Seasons";
import Content from "./components/Content/Content";
import AllView from "./components/main/AllView";
import "./App.css";
import Search from "./Pages/Search";

let initial = true;

function App() {
  const dispatch = useAppDispatch();
  const festivalState = useSelector((state: RootState) => state.festival);
  console.log("app");

  useEffect(() => {
    console.log("fetchThunk");
    dispatch(fetchFromData());
  }, [dispatch]);

  useEffect(() => {
    if (initial && festivalState.successGetData) {
      console.log("?");
      dispatch(festivalActions.sortDataByMonth());
      dispatch(festivalActions.sortDataBySeason());
      dispatch(festivalActions.sortDataByRegion());
      initial = false;
    }
  }, [dispatch, festivalState.successGetData]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <StartPage /> },
        {
          path: "all-festival",
          element: <AllFestivalPage />,
          children: [
            {
              index: true,
              element: <AllView />,
            },
            { path: ":eventId", element: <Content /> },
          ],
        },
        {
          path: "regions",
          element: <RegionPage />,
          children: [
            { index: true, element: <Regions /> },
            { path: ":eventID", element: <Content /> },
          ],
        },
        {
          path: "seasons",
          element: <SeasonPage />,
          children: [
            { path: ":seasonKey", element: <Seasons /> },
          ],
        },
        { path: "/search", element: <Search /> }, //수정필요
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
