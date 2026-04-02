import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { TourDataType } from "./types/FetchType";
import { AuthProvider } from "context/AuthContext";
import RootLayout from "./pages/Root";
import Loading from "./common/loading/Loading";
import GetDataError from "./common/error/GetDataError";
import MainPage from "./pages/main/MainPage";
import ProtectedRoute from "common/ProtectedRoute";
import LoginPage from "./pages/login/LoginPage";
import "./App.css";

const PageNotFound = lazy(() => import("./common/error/PageNotFound"));
const TourDataPage = lazy(() => import("./pages/tourdata/TourDataPage"));
const ContentPage = lazy(() => import("./pages/content/CotentPage"));
const ThemePage = lazy(() => import("./pages/theme/ThemePage"));
const DocumentPage = lazy(() => import("./pages/docs/DocumentPage"));
const About = lazy(() => import("./features/docs/About"));
const User = lazy(() => import("./pages/user/UserPage"));
const PrivacyPolicy = lazy(() => import("./features/docs/PrivacyPolicy"));
const Service = lazy(() => import("./features/docs/Service"));
const Question = lazy(() => import("./pages/question/Question"));
const SearchPage = lazy(() => import("pages/search/SearchPage"));

const withSuspense = <Props extends object>(
  Component: React.FunctionComponent<Props>,
  props: Props = {} as Props,
) => (
  <Suspense fallback={<Loading height="400px" />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <GetDataError />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/tourdata/:category", element: withSuspense(TourDataPage) },
      { path: "content", element: withSuspense(ContentPage) },
      { path: "theme", element: withSuspense(ThemePage) },
      {
        element: <ProtectedRoute />,
        children: [{ path: "user", element: withSuspense(User) }],
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
      { path: "search", element: withSuspense(SearchPage) },
      { path: "question", element: withSuspense(Question) },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
