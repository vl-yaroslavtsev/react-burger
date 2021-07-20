import styles from "./app-header.module.css";

import React from "react";
import { useRouteMatch, Link } from "react-router-dom";
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
    <header className={cn(styles.header)}>
      <ul className={styles.content}>
        <li className={styles.contentItem}>
          <nav className={cn(styles.navigation, "mt-4 mb-4")}>
            <ul>
              <li className={styles.navItem}>
                <HeaderItem icon={BurgerIcon} path="/">
                  Конструктор
                </HeaderItem>
              </li>
              <li className={cn(styles.navItem, "ml-2")}>
                <HeaderItem icon={ListIcon} path="/feed">
                  Лента заказов
                </HeaderItem>
              </li>
            </ul>
          </nav>
        </li>
        <li className={styles.contentItemCenter}>
          <Link to="/">
            <Logo />
          </Link>
        </li>
        <li className={styles.contentItemRight}>
          <HeaderItem icon={ProfileIcon} path="/profile">
            Личный кабинет
          </HeaderItem>
        </li>
      </ul>
    </header>
  );
}

export default AppHeader;
