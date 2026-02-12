import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import FeedbackToast from "common/feedback-toast/FeedbackToast";
import UserMenu from "features/user/UserMenu";
import UserLogs from "features/user/UserLogs";
import UserInfo from "features/user/UserInfo";

const UserPage = () => {
  const userData = useSelector((state: RootState) => state.firebase);
  const [category, setCategory] = useState<
    "userInfo" | "myComment" | "likedComment" | "likedContent"
  >("userInfo");

  return (
    <main
      style={{
        position: "relative",
        background: "rgb(253, 253, 253)",
        width: "100%",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <UserMenu setCategory={setCategory} userData={userData} />
      {category === "userInfo" ? (
        <UserInfo userData={userData} />
      ) : (
        <UserLogs category={category} userData={userData} />
      )}
      <FeedbackToast />
    </main>
  );
};

export default UserPage;
