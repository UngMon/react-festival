import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/index";

interface Props {
  isPublicOnly?: boolean; // 로그인한 사람은 못 들어오는 페이지인가? (예: 로그인/회원가입)
}

const ProtectedRoute = ({ isPublicOnly }: Props) => {
  const currentUser = auth.currentUser;

  // 1. 로그인한 유저가 로그인/회원가입 페이지에 접근할 때 -> 메인으로 리다이렉트
  if (isPublicOnly && currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. 로그인 안 한 유저가 마이페이지 등에 접근할 때 -> 로그인 페이지로 리다이렉트
  if (!isPublicOnly && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
