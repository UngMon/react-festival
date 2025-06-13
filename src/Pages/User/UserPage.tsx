import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UserMenu from "./UserMenu";
import UseLogs from "./UserLogs";
import "./UserPage.css";

const UserPage = () => {
  console.log("USerPage Render");
  const userData = useSelector((state: RootState) => state.firebase);
  // const [openSide, setOpenSide] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("myComment");

  return (
    <div className="user-area">
      {/* <div
        className="user-menu-arrow"
        onClick={() => setOpenSide(true)}
        ref={arrowRef}
      >
        <FontAwesomeIcon icon={faRightLong} />
      </div> */}
      <UserMenu setCategory={setCategory} userData={userData} />
      <UseLogs category={category} userData={userData} />
    </div>
  );
};

export default UserPage;
