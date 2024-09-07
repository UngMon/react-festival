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
const Theme = lazy(() => import("./components/main/Theme"));
const EtcLayout = lazy(() => import("./pages/EtcLayout"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Service = lazy(() => import("./pages/Service"));
const Question = lazy(() => import("./pages/Question"));

function App() {
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
              <Main title="관광지" />
            </Suspense>
          ),
        },
        {
          path: "culture",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="문화시설" />
            </Suspense>
          ),
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="축제/공연/행사" />
            </Suspense>
          ),
        },
        {
          path: "travel",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="여행코스" />
            </Suspense>
          ),
        },
        {
          path: "leports",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="레포츠" />
            </Suspense>
          ),
        },
        {
          path: "result",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading />}>
              <Main title="검색" />
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
              <Theme />
            </Suspense>
          ),
        },
        {
          path: "/etc",
          element: (
            <Suspense fallback={<Loading />}>
              <EtcLayout />
            </Suspense>
          ),
          children: [
            {
              path: "about",
              element: (
                <Suspense fallback={<Loading />}>
                  <About />
                </Suspense>
              ),
            },
            {
              path: "privacypolicy",
              element: (
                <Suspense fallback={<Loading />}>
                  <PrivacyPolicy />
                </Suspense>
              ),
            },
            {
              path: "service",
              element: (
                <Suspense fallback={<Loading />}>
                  <Service />
                </Suspense>
              ),
            },
            {
              path: "question",
              element: (
                <Suspense fallback={<Loading />}>
                  <Question />
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
          // element: <div></div>,
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
