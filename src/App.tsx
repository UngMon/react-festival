import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from "react";
import { getFestiavalData, getFriebaseData } from "./redux/fetch-action";
import { useAppDispatch } from "./redux/store";
import { auth } from "./firebase";
import { firebaseActions } from "./redux/firebase-slice";
import { onAuthStateChanged } from "firebase/auth";
import StartPage from "./pages/Start";
import LoginPage from "./pages/Login";
import RootLayout from "./pages/Root";
import RegionPage from "./pages/Regions";
import SeasonPage from "./pages/Seasons";
import AllFestivalPage from "./pages/MonthFestival";
import Regions from "./components/main/Regions";
import Seasons from "./components/main/Seasons";
import Content, { loader as contentLoader } from "./components/content/Content";
import AllView from "./components/main/AllView";
import ResultPage from "./pages/Result";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./components/error/PageNotFound";
import "./App.css";
import GetDataError from "./components/error/GetDataError";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFriebaseData());
    dispatch(getFestiavalData());

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        dispatch(
          firebaseActions.setUserData({ uid, displayName, email, photoURL })
        );
      } else {
        dispatch(firebaseActions.notLoginUser());
      }
    });
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <StartPage /> },
        {
          path: "month",
          element: <AllFestivalPage />,
          children: [
            {
              path: ":monthKey",
              element: <AllView />,
            },
          ],
        },
        {
          path: "regions",
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
          errorElement: <GetDataError />,
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
        },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
