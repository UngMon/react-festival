import { Outlet } from "react-router-dom";
import PolicyNavigator from "../components/ui/PolicyNavigator";

const EtcLayout = () => {

  return (
    <>
      <PolicyNavigator />
      <Outlet />
    </>
  );
};

export default EtcLayout;
