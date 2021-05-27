import styles from "./app-header.module.css";

import React from "react";
import cn from "classnames";
import {
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function AppHeader() {
  return (
    <header className={cn(styles.header, "ml-10 mr-10 mt-10")}>
      <ul className={cn(styles.content, "text text_type_main-default")}>
        <li className={styles.contentItem}>
          <nav className={cn(styles.navigation)}>
            <ul>
              <li className={styles.contentItem}>
                <BurgerIcon type="primary" /> Конструктор
              </li>
              <li className={styles.contentItem}>
                <ListIcon type="primary" /> Лента заказов
              </li>
            </ul>
          </nav>
        </li>
        <li className={styles.contentItemCenter}>
          <Logo />
        </li>
        <li className={styles.contentItemRight}>
          <ProfileIcon type="primary" /> Личный кабинет
        </li>
      </ul>
    </header>
  );
}

export default AppHeader;
