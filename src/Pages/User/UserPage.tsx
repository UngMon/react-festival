import { useState } from "react";
import FeedbackToast from "common/feedback-toast/FeedbackToast";
import UserLogs from "features/user/logs/UserLogs";
import Account from "features/user/account/Account";
import SubMenu from "features/user/ui/SubMenu";
import Title from "features/user/ui/Title";
import "./UserPage.css";

const UserPage = () => {
  const [category, setCategory] = useState<string>("userInfo");

  return (
    <main className="user-page-container">
      <div className="user-page-back-img" />
      <Title category={category} />
      <div className="user-page-box">
        <SubMenu setCategory={setCategory} category={category} />
        {category === "userInfo" ? (
          <Account />
        ) : (
          <UserLogs category={category} />
        )}
        <FeedbackToast />
      </div>
    </main>
  );
};

export default UserPage;
