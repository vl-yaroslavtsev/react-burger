import styles from "./app-header.module.css";

import React from "react";
import cn from "classnames";
import {
  Logo,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function NavItem({ Icon, label, active = false }) {
  return (
    <div
      className={
        (styles.container, "text text_type_main-default pl-5 pr-5 pt-4 pb-4")
      }
    >
      <Icon type={active ? "secondary" : "primary"} />
      <div class={styles.label}>{label}</div>
    </div>
  );
}

export default NavItem;
