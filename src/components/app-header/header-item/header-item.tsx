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

const HeaderItem: React.FC<IHeaderItemProps> = ({
  icon: Icon,
  children,
  path,
}) => {
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
      <span
        className={cn(styles.text, { text_color_inactive: !match }, "ml-2")}
      >
        {children}
      </span>
    </Link>
  );
};

export default HeaderItem;
