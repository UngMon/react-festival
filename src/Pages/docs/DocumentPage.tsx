import { Outlet } from "react-router-dom";
import PolicyNavigator from "../../features/docs/Navigator";

const DocumentPage = () => {

  return (
    <>
      <PolicyNavigator />
      <Outlet />
    </>
  );
};

export default DocumentPage;
