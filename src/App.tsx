import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { getFestiavalData, getFriebaseData } from "./redux/fetch-action";
import { useAppDispatch } from "./redux/store";
import { auth } from "./firebase/firestore";
import { firebaseActions } from "./redux/firebase-slice";
import { onAuthStateChanged } from "firebase/auth";
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
import Error from "./Pages/Error";
import LoginAccessError from "./components/Error/LoginAccessError";
import "./App.css";
import PageNotFound from "./components/Error/PageNotFound";

function App() {
  console.log("app");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFriebaseData());
    dispatch(getFestiavalData());

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        console.log(user);

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
    },
    {
      path: "error",
      element: <Error />,
      children: [
        {
          path: "login-access",
          element: <LoginAccessError />,
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
