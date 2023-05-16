import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { getFestiavalData } from "./redux/fetch-action";
import { useAppDispatch } from "./redux/store";
import { auth } from "./firebase";
import { firebaseActions } from "./redux/firebase-slice";
import { onAuthStateChanged } from "firebase/auth";
import RootLayout from './pages/Root'
import Loading from "./components/ui/Loading";
import StartPage from "./pages/Start";
import LoadingTwo from "./components/ui/LoadingTwo";
import GetDataError from "./components/error/GetDataError";
import "./App.css";

const PageNotFound = lazy(() => import('./components/error/PageNotFound'));
const LoginPage = lazy(() => import("./pages/Login"));
const FestivalPage = lazy(() => import("./pages/FestivalPage"));
const Festival = lazy(() => import("./components/main/Festival"));
const ResultPage = lazy(() => import("./pages/Result"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Content = lazy(() => import("./components/content/Content"));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
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
        {
          index: true,
          element: <StartPage />,
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<LoadingTwo />}>
              <FestivalPage />
            </Suspense>
          ),
          children: [
            {
              path: ":festivalKey",
              element: (
                <Suspense fallback={<LoadingTwo />}>
                  <Festival />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "search",
          element: (
            <Suspense fallback={<Loading />}>
              <SearchPage />
            </Suspense>
          ),
        },
        {
          path: "result",
          children: [
            {
              path: ":keyword",
              element: (
                <Suspense fallback={<Loading />}>
                  <ResultPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "content",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":contentId",
              element: (
                <Suspense fallback={<Loading />}>
                  <Content />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Loading />}>
          <LoginPage />
        </Suspense>
      ),
      children: [
        {
          path: "oauth",
        },
      ],
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loading />}>
          <PageNotFound />
        </Suspense>
      ),
    },
  ]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
