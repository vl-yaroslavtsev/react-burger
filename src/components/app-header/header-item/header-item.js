import styles from "./header-item.module.css";

import cn from "classnames";

function HeaderItem({ icon: Icon, children, active = false }) {
  return (
    <div
      className={cn(
        styles.container,
        "text text_type_main-default pl-5 pr-5 pt-4 pb-4"
      )}
    >
      <Icon type={active ? "primary" : "secondary"} />
      <span class={cn({ text_color_inactive: !active }, "ml-2")}>
        {children}
      </span>
    </div>
  );
}

export default HeaderItem;
