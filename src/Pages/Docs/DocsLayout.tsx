import { Outlet } from "react-router-dom";
import PolicyNavigator from "./Navigator";

const DocsLayout = () => {

  return (
    <>
      <PolicyNavigator />
      <Outlet />
    </>
  );
};

export default DocsLayout;
