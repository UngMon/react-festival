import { Outlet } from "react-router-dom";
import PolicyNavigator from "./Navigator";

const EtcLayout = () => {

  return (
    <>
      <PolicyNavigator />
      <Outlet />
    </>
  );
};

export default EtcLayout;
