import styles from "./modal-overlay.module.css";
import cn from "classnames";

function ModalOverlay({ visible = false, onClose = () => {} }) {
  return (
    <div
      className={cn(styles.container, { [styles.hidden]: !visible })}
      onClick={onClose}
    ></div>
  );
}

export default ModalOverlay;
