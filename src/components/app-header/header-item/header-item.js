import cn from "classnames";
import PropTypes from "prop-types";
import { useRouteMatch, Link } from "react-router-dom";

import styles from "./header-item.module.css";

function HeaderItem({ icon: Icon, children, path }) {
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

HeaderItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default HeaderItem;
