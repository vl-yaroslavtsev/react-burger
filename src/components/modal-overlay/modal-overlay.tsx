import cn from "classnames";
import styles from "./modal-overlay.module.css";

interface IModalOverlayProps {
  visible?: boolean;
  onClose?: () => void;
}

const ModalOverlay: React.FC<IModalOverlayProps> = ({
  visible = false,
  onClose = () => {},
}) => {
  return (
    <div
      className={cn(styles.container, { [styles.hidden]: !visible })}
      onClick={onClose}
    ></div>
  );
};

export default ModalOverlay;
