import { useEffect, useRef, memo, ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./modal.module.css";

import ModalOverlay from "../modal-overlay/modal-overlay";

const modalRoot = document.getElementById("react-modals") as HTMLElement;
const ESC_KEY = "Escape";

let visibleModals: React.MutableRefObject<undefined>[] = [];

interface IModalProps {
  children: ReactNode;
  header?: ReactNode;
  visible?: boolean;
  onClose?: () => void;
}
const Modal = memo(
  ({ children, header = "", visible = false, onClose }: IModalProps) => {
    const modal = useRef();
    const closeVisible = !!onClose;

    useEffect(() => {
      if (visible) {
        visibleModals.push(modal);
      } else {
        const index = visibleModals.indexOf(modal);
        visibleModals.splice(index, 1);
      }
    }, [visible]);

    // Если открыто несколько модальных окон, закрываем по ESC только самое верхнее
    useEffect(() => {
      const keyDownHandler = (e: KeyboardEvent) => {
        if (
          e.key === ESC_KEY &&
          visibleModals[visibleModals.length - 1] === modal &&
          onClose
        ) {
          onClose();
        }
      };

      if (visible) {
        document.addEventListener("keydown", keyDownHandler);
      }

      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }, [onClose, visible]);

    return createPortal(
      <>
        <ModalOverlay visible={visible} onClose={onClose} />
        <div
          className={cn(styles.container, "pt-10 pl-10 pr-10 pb-10", {
            [styles.hidden]: !visible,
          })}
        >
          <h1 className={cn(styles.title, "text text_type_main-large pr-7")}>
            {header}
          </h1>
          {closeVisible && (
            <div className={styles.closeButton}>
              <CloseIcon type="primary" onClick={onClose} />
            </div>
          )}
          <section className={cn(styles.content)}>{children}</section>
        </div>
      </>,
      modalRoot
    );
  }
);

export default Modal;
