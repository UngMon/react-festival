import { useState } from "react";
import FeedbackToast from "common/feedback-toast/FeedbackToast";
import UserLogs from "features/user/logs/UserLogs";
import Account from "features/user/account/Account";
import SubMenu from "features/user/ui/SubMenu";
import "./UserPage.css";
import Header from "features/user/ui/Header";

const UserPage = () => {
  const [category, setCategory] = useState<string>("userInfo");

  return (
    <main className="user-page-container">
      <Header />
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
