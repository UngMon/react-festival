import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UserMenu from "./UserMenu";
import UseLogs from "./UserLogs";
import "./UserPage.css";

const UserPage = () => {
  console.log("USerPage Render");
  const userData = useSelector((state: RootState) => state.firebase);
  const [category, setCategory] = useState<string>("myComment");

  return (
    <div className="user-area">
      <UserMenu setCategory={setCategory} userData={userData} />
      <UseLogs category={category} userData={userData} />
    </div>
  );
};

export default UserPage;
