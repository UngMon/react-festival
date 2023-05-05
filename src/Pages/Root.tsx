import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../ScrollToTop";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop/>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;
