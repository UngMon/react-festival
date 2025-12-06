import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FeedbackToast from "components/Content/Comments/Modal/FeedbackToast";
import UserMenu from "./UserMenu";
import UseLogs from "./UserLogs";

const UserPage = () => {
  const userData = useSelector((state: RootState) => state.firebase);
  const [category, setCategory] = useState<
    "myComment" | "likedComment" | "likedContent"
  >("myComment");

  return (
    <div
      style={{
        position: "relative",
        background: "rgb(250, 250, 250)",
        width: "100%",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <UserMenu setCategory={setCategory} userData={userData} />
      <UseLogs category={category} userData={userData} />
      <FeedbackToast />
    </div>
  );
};

export default UserPage;
