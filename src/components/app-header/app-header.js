import styles from "./app-header.module.css";

import React from "react";
import cn from "classnames";
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import HeaderItem from "./header-item/header-item";

function AppHeader() {
  return (
    <header className={cn(styles.header, "ml-10 mr-10 mt-10")}>
      <ul className={styles.content}>
        <li className={styles.contentItem}>
          <nav className={cn(styles.navigation, "mt-4 mb-4")}>
            <ul>
              <li className={styles.navItem}>
                <HeaderItem icon={BurgerIcon} active={true}>
                  Конструктор
                </HeaderItem>
              </li>
              <li className={cn(styles.navItem, "ml-2")}>
                <HeaderItem icon={ListIcon}>Лента заказов</HeaderItem>
              </li>
            </ul>
          </nav>
        </li>
        <li className={styles.contentItemCenter}>
          <Logo />
        </li>
        <li className={styles.contentItemRight}>
          <HeaderItem icon={ProfileIcon}>Личный кабинет</HeaderItem>
        </li>
      </ul>
    </header>
  );
}

export default AppHeader;
