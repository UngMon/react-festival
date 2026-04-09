import { useState } from "react";
import SearchButton from "features/header/search/SearchButton";
import LoginButton from "features/header/login/LoginButton";
import styles from "./Header.module.css";
import Logo from "features/header/logo/Logo";

const Header = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  return (
    <header className={styles["header"]}>
      <Logo type="start" />
      <div className={styles["header__interaction"]}>
        <SearchButton openSearch={openSearch} setOpenSearch={setOpenSearch} />
        <LoginButton user_page={true} />
      </div>
    </header>
  );
};

export default Header;
