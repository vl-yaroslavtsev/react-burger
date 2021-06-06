import cn from "classnames";
import PropTypes from "prop-types";
import styles from "./modal-overlay.module.css";

function ModalOverlay({ visible = false, onClose = () => {} }) {
  return (
    <div
      className={cn(styles.container, { [styles.hidden]: !visible })}
      onClick={onClose}
    ></div>
  );
}

ModalOverlay.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ModalOverlay;
