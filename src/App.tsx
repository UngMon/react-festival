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
const DocsLayout = lazy(() => import("./pages/Docs/DocsLayout"));
const About = lazy(() => import("./pages/Docs/About"));
const User = lazy(() => import("./pages/User/UserPage"));
const PrivacyPolicy = lazy(() => import("./pages/Docs/PrivacyPolicy"));
const Service = lazy(() => import("./pages/Docs/Service"));
const Question = lazy(() => import("./pages/Question/Question"));

const withSuspense = <P extends object>(
  Component: React.FunctionComponent<P>,
  props: P = {} as P
) => (
  <Suspense fallback={<Loading height="400px" />}>
    <Component {...props} />
  </Suspense>
);

const pathArray: TitleType[] = [
  "tour", "culture", "festival", "travel",
  "leports", "lodging", "shoping", "restaurant", "search",
];

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <GetDataError />,
    children: [
      { index: true, element: <MainVisual /> },
      ...pathArray.map((title) => ({
        path: title,
        element: withSuspense(Main, { title }),
      })),
      {
        path: "content",
        element: withSuspense(Content),
      },
      {
        path: "pick",
        element: withSuspense(Theme),
      },
      {
        path: "docs",
        element: withSuspense(PageNotFound),
      },
      {
        element: <DocsLayout />,
        children: [
          { path: "docs/about", element: withSuspense(About) },
          { path: "docs/privacypolicy", element: withSuspense(PrivacyPolicy) },
          { path: "docs/service", element: withSuspense(Service) },
        ],
      },
      {
        path: "question",
        element: withSuspense(Question),
      },
      {
        path: "user",
        element: withSuspense(User),
      },
    ],
  },
  {
    path: "login",
    element: withSuspense(LoginPage),
    children: [{ path: "oauth" }],
  },
  {
    path: "*",
    element: withSuspense(PageNotFound),
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
