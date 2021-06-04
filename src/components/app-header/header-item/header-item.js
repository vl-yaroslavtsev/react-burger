import cn from "classnames";
import PropTypes from "prop-types";

import styles from "./header-item.module.css";

function HeaderItem({ icon: Icon, children, active = false }) {
  return (
    <div
      className={cn(
        styles.container,
        "text text_type_main-default pl-5 pr-5 pt-4 pb-4"
      )}
    >
      <Icon type={active ? "primary" : "secondary"} />
      <span className={cn({ text_color_inactive: !active }, "ml-2")}>
        {children}
      </span>
    </div>
  );
}

HeaderItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.element,
  active: PropTypes.bool,
};

export default HeaderItem;
