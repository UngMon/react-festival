import ScrollToTop from "./ScrollToTop";
import HeaderContainer from "../features/header/HeaderContainer";
import { Outlet } from "react-router-dom";
import Footer from "../features/footer/Footer";
import TopButton from "features/ui/top-button/TopButton";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <HeaderContainer />
      <Outlet />
      <Footer />
      <TopButton />
    </>
  );
};

export default RootLayout;
