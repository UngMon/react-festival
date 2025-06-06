import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import UserMenu from "./UserMenu";
import UseLogs from "./UserLogs";
import "./UserPage.css";

const UserPage = () => {
  console.log("USerPage Render");
  const { user_photo, user_id, user_name, user_email } = useSelector(
    (state: RootState) => state.firebase
  );
  const [openSide, setOpenSide] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("myComment");
  const arrowRef = useRef<HTMLDivElement>(null);

  return (
    <div className="user-area">
      <div
        className="user-menu-arrow"
        onClick={() => setOpenSide(true)}
        ref={arrowRef}
      >
        <FontAwesomeIcon icon={faRightLong} />
      </div>
      <UserMenu
        openSide={openSide}
        setOpenSide={setOpenSide}
        setCategory={setCategory}
        user_photo={user_photo}
        user_name={user_name}
        user_email={user_email}
        arrowRef={arrowRef}
      />
      <UseLogs category={category} user_id={user_id} />
    </div>
  );
};

export default UserPage;
