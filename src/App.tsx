import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/Root";
import Loading from "./components/loading/Loading";
import GetDataError from "./components/error/GetDataError";
import "./App.css";

const PageNotFound = lazy(() => import("./components/error/PageNotFound"));
const LoginPage = lazy(() => import("./pages/Login"));
const Main = lazy(() => import("./components/main/Main"));
const ResultPage = lazy(() => import("./pages/Result"));
const Content = lazy(() => import("./components/content/Content"));
const Start = lazy(() => import("./components/main/Start"));

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Start />,
        },
        {
          path: "tour",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":tourKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Main title="tour" />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "culture",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":cultureKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Main title="culture" />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":festivalKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Main title="festival" />
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
                  <Main title="travel" />
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
          path: "trend",
          errorElement: <GetDataError />,
          children: [
            {
              path: ":trendKey",
              element: (
                <Suspense fallback={<Loading />}>
                  <Main title="trend" />
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
