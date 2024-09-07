import { useRef } from "react";
import { Outlet } from "react-router-dom";
import PolicyNavigator from "../components/ui/PolicyNavigator";

const EtcLayout = () => {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PolicyNavigator />
      <Outlet />
    </>
  );
};

export default EtcLayout;
