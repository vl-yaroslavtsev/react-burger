import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import PropTypes from "prop-types";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./modal.module.css";

import ModalOverlay from "../modal-overlay/modal-overlay";

const modalRoot = document.getElementById("react-modals");
const ESC_KEY_CODE = 27;

function Modal({ children, header = "", visible = false, onClose = () => {} }) {
  const modalRef = useRef(null);

  const keyDownHandler = (e) => {
    if (e.keyCode === ESC_KEY_CODE) {
      onClose();
    }
  };

  useEffect(() => {
    if (visible) {
      modalRef.current.focus();
    }
  }, [visible]);

  return createPortal(
    <>
      <ModalOverlay visible={visible} onClose={onClose} />
      <div
        className={cn(styles.container, "pt-10 pl-10 pr-10 pb-10", {
          [styles.hidden]: !visible,
        })}
        onKeyDown={keyDownHandler}
        ref={modalRef}
        tabIndex="0"
      >
        <h1 className={cn(styles.title, "text text_type_main-large pr-7")}>
          {header}
        </h1>
        <div className={styles.closeButton}>
          <CloseIcon type="primary" onClick={onClose} />
        </div>
        <section className={cn(styles.content)}>{children}</section>
      </div>
    </>,
    modalRoot
  );
}

Modal.propTypes = {
  children: PropTypes.element,
  header: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Modal;