import cn from "classnames";
import styles from "./modal-overlay.module.css";

interface IModalOverlayProps {
  visible?: boolean;
  onClose?: () => void;
}

function ModalOverlay({
  visible = false,
  onClose = () => {},
}: IModalOverlayProps) {
  return (
    <div
      className={cn(styles.container, { [styles.hidden]: !visible })}
      onClick={onClose}
    ></div>
  );
}

export default ModalOverlay;
