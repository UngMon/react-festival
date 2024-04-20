import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/Root";
import Loading from "./components/loading/Loading";
import GetDataError from "./components/error/GetDataError";
import Test from "./components/main/Test";
import "./App.css";

const PageNotFound = lazy(() => import("./components/error/PageNotFound"));
const LoginPage = lazy(() => import("./pages/Login"));
const Main = lazy(() => import("./components/main/Main"));
const Content = lazy(() => import("./components/content/Content"));
const Pick = lazy(() => import("./components/main/Pick"));

function App() {
  console.log("App Render");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Test />,
        },
        {
          path: "tour",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="tour" />
            </Suspense>
          ),
        },
        {
          path: "culture",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="culture" />
            </Suspense>
          ),
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="festival" />
            </Suspense>
          ),
        },
        {
          path: "travel",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="travel" />
            </Suspense>
          ),
        },
        {
          path: "result",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="result" />
            </Suspense>
          ),
        },
        {
          path: "trend",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="trend" />
            </Suspense>
          ),
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
        {
          path: "/pick",
          element: (
            <Suspense fallback={<Loading />}>
              <Pick />
            </Suspense>
          ),
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
          element: (
            <div>
              <p>auto page</p>
            </div>
          ),
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
