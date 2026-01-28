import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FeedbackToast from "components/Content/Comments/Modal/FeedbackToast";
import UserMenu from "./UserMenu";
import UseLogs from "./UserLogs";
import UserInfo from "./UserInfo";

const UserPage = () => {
  const userData = useSelector((state: RootState) => state.firebase);
  const [category, setCategory] = useState<
    "userInfo" | "myComment" | "likedComment" | "likedContent"
  >("userInfo");

  return (
    <div
      style={{
        position: "relative",
        background: "rgb(253, 253, 253)",
        width: "100%",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* <UserMenu setCategory={setCategory} userData={userData} /> */}
      {category === "userInfo" && <UserInfo userData={userData} />}
      {/* category !== 'userInfo" && <UseLogs category={category} userData={userData} /> */}
      <FeedbackToast />
    </div>
  );
};

export default UserPage;
