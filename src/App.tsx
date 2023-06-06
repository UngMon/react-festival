import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "./redux/store";
import { auth } from "./firebase";
import { firebaseActions } from "./redux/firebase-slice";
import { onAuthStateChanged } from "firebase/auth";
import RootLayout from "./pages/Root";
import Loading from "./components/loading/Loading";
import GetDataError from "./components/error/GetDataError";
import "./App.css";

const PageNotFound = lazy(() => import("./components/error/PageNotFound"));
const LoginPage = lazy(() => import("./pages/Login"));
const TourPage = lazy(() => import("./pages/TourPage"));
const Tour = lazy(() => import("./components/main/Tour"));
const FestivalPage = lazy(() => import("./pages/FestivalPage"));
const Festival = lazy(() => import("./components/main/Festival"));
const ResultPage = lazy(() => import("./pages/Result"));
const Content = lazy(() => import("./components/content/Content"));
const StartPage = lazy(() => import("./pages/Start"));
const CulturePage = lazy(() => import("./pages/CulturePage"));
const Culture = lazy(() => import("./components/main/Culture"));
const Travel = lazy(() => import("./components/main/Travel"));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
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
          path: "tour",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <TourPage />
            </Suspense>
          ),
          children: [
            {
              path: ":tourKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Tour />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "culture",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <CulturePage />
            </Suspense>
          ),
          children: [
            {
              path: ":cultureKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Culture />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <FestivalPage />
            </Suspense>
          ),
          children: [
            {
              path: ":festivalKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Festival />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "travel",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":travelKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Travel />
                </Suspense>
              ),
            },
          ],
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
