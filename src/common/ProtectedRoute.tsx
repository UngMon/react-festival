import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import Loading from "./loading/Loading";

interface Props {
  isPublicOnly?: boolean; // 로그인한 사람은 못 들어오는 페이지인가? (예: 로그인/회원가입)
}

const ProtectedRoute = ({ isPublicOnly }: Props) => {
  const { user, status } = useAuth(); // Context에서 유저 정보 가져오기

  // 1. 로그인한 유저가 로그인/회원가입 페이지에 접근할 때 -> 메인으로 리다이렉트
  if (status === "fulfilled" && isPublicOnly && user) {
    return <Navigate to="/" replace={true} />;
  }

  // 2. 로그인 안 한 유저가 마이페이지 등에 접근할 때 -> 로그인 페이지로 리다이렉트
  if (status === "fulfilled" && !isPublicOnly && !user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <>
      {status === "pending" && (
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading height="110px" />
        </div>
      )}
      {status === "fulfilled" && <Outlet />}
    </>
  );
};

export default ProtectedRoute;
