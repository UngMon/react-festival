import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { TourDataType } from "./types/FetchType";
import RootLayout from "./pages/Root";
import Loading from "./common/loading/Loading";
import GetDataError from "./common/error/GetDataError";
import MainPage from "./pages/main/MainPage";
import ProtectedRoute from "common/ProtectedRoute";
import "./App.css";

const PageNotFound = lazy(() => import("./common/error/PageNotFound"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const TourDataPage = lazy(() => import("./pages/tour-data/TourDataPage"));
const ContentPage = lazy(() => import("./pages/content/CotentPage"));
const ThemePage = lazy(() => import("./pages/theme/ThemePage"));
const DocumentPage = lazy(() => import("./pages/docs/DocumentPage"));
const About = lazy(() => import("./features/docs/About"));
const User = lazy(() => import("./pages/user/UserPage"));
const PrivacyPolicy = lazy(() => import("./features/docs/PrivacyPolicy"));
const Service = lazy(() => import("./features/docs/Service"));
const Question = lazy(() => import("./pages/question/Question"));

const withSuspense = <Props extends object>(
  Component: React.FunctionComponent<Props>,
  props: Props = {} as Props,
) => (
  <Suspense fallback={<Loading height="400px" />}>
    <Component {...props} />
  </Suspense>
);

const pathArray: TourDataType[] = [
  "tour",
  "culture",
  "festival",
  "travel",
  "leports",
  "lodging",
  "shopping",
  "restaurant",
  "search",
];

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <GetDataError />,
    children: [
      { index: true, element: <MainPage /> },
      ...pathArray.map((tourDataType) => ({
        path: tourDataType,
        element: withSuspense(TourDataPage, { tourDataType }),
      })),
      { path: "content", element: withSuspense(ContentPage) },
      { path: "theme", element: withSuspense(ThemePage) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "question", element: withSuspense(Question) },
          { path: "user", element: withSuspense(User) },
        ],
      },
      {
        path: "docs",
        element: withSuspense(DocumentPage),
        children: [
          { index: true, element: <Navigate to="about" replace /> },
          { path: "about", element: withSuspense(About) },
          { path: "privacypolicy", element: withSuspense(PrivacyPolicy) },
          { path: "service", element: withSuspense(Service) },
        ],
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
