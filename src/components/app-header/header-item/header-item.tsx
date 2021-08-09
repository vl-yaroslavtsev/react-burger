import { ReactNode } from "react";
import cn from "classnames";
import { useRouteMatch, Link } from "react-router-dom";
import { BurgerIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./header-item.module.css";

interface IHeaderItemProps {
  icon: typeof BurgerIcon;
  path: string;
  children: ReactNode;
}

function HeaderItem({ icon: Icon, children, path }: IHeaderItemProps) {
  const match = useRouteMatch({ path, exact: path === "/" });
  return (
    <Link
      className={cn(
        styles.container,
        "text text_type_main-default pl-5 pr-5 pt-4 pb-4"
      )}
      to={path}
    >
      <Icon type={match ? "primary" : "secondary"} />
      <span className={cn({ text_color_inactive: !match }, "ml-2")}>
        {children}
      </span>
    </Link>
  );
}

export default HeaderItem;
