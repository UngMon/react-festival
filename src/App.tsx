import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { TitleType } from "./type/FetchType";
import RootLayout from "./pages/Root";
import Loading from "./components/Loading/Loading";
import GetDataError from "./components/Error/GetDataError";
import MainVisual from "./pages/Main/MainVisual";
import "./App.css";

const PageNotFound = lazy(() => import("./components/Error/PageNotFound"));
const LoginPage = lazy(() => import("./pages/Login/Login"));
const Main = lazy(() => import("./components/Card/CardContainer"));
const Content = lazy(() => import("./components/Content/Content"));
const Theme = lazy(() => import("./pages/Theme/Theme"));
const EtcLayout = lazy(() => import("./pages/Etc/EtcLayout"));
const About = lazy(() => import("./pages/Etc/About"));
const User = lazy(() => import("./pages/User/UserPage"));
const PrivacyPolicy = lazy(() => import("./pages/Etc/PrivacyPolicy"));
const Service = lazy(() => import("./pages/Etc/Service"));
const Question = lazy(() => import("./pages/Question/Question"));

const pathArray: TitleType[] = [
  "tour",
  "culture",
  "festival",
  "travel",
  "leports",
  "lodging",
  "shoping",
  "restaurant",
  "search",
];

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <GetDataError />,
      children: [
        { index: true, element: <MainVisual /> },
        ...pathArray.map((title) => ({
          path: title,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title={title} />
            </Suspense>
          ),
        })),
        {
          path: "content",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Content />
            </Suspense>
          ),
        },
        {
          path: "pick",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Theme />
            </Suspense>
          ),
        },
        {
          path: "etc",
          element: <EtcLayout />,
          children: [
            {
              path: "about",
              element: (
                <Suspense fallback={<Loading height="400px" />}>
                  <About />
                </Suspense>
              ),
            },
            {
              path: "privacypolicy",
              element: (
                <Suspense fallback={<Loading height="400px" />}>
                  <PrivacyPolicy />
                </Suspense>
              ),
            },
            {
              path: "service",
              element: (
                <Suspense fallback={<Loading height="400px" />}>
                  <Service />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "question",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Question />
            </Suspense>
          ),
        },
        {
          path: "user",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <User />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "login",
      element: (
        <Suspense fallback={<Loading height="400px" />}>
          <LoginPage />
        </Suspense>
      ),
      children: [{ path: "oauth" }],
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loading height="400px" />}>
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
