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
const User = lazy(() => import("./pages/User/UserPage"));
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
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="tour" />
            </Suspense>
          ),
        },
        {
          path: "culture",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="culture" />
            </Suspense>
          ),
        },
        {
          path: "festival",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="festival" />
            </Suspense>
          ),
        },
        {
          path: "travel",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="travel" />
            </Suspense>
          ),
        },
        {
          path: "leports",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="leports" />
            </Suspense>
          ),
        },
        {
          path: "search",
          errorElement: <GetDataError />,
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Main title="search" />
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
                <Suspense fallback={<Loading height="400px" />}>
                  <Content />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/pick",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <Theme />
            </Suspense>
          ),
        },
        {
          path: "/etc",
          element: (
            <Suspense fallback={<Loading height="400px" />}>
              <EtcLayout />
            </Suspense>
          ),
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
            {
              path: "question",
              element: (
                <Suspense fallback={<Loading height="400px" />}>
                  <Question />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "/user",
          element: (
            <Suspense fallback={<Loading height="500px" />}>
              <User />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "/login",
      element: (
        <Suspense fallback={<Loading height="400px" />}>
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
