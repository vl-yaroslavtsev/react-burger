import { useState, useCallback, useRef, RefObject } from "react";
import { useSelector, useDispatch } from "../../services/hooks";
import { useHistory } from "react-router-dom";
import cn from "classnames";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";

import OrderDetails from "../order-details/order-details";
import Modal from "../modal/modal";
import Spinner from "../spinner/spinner";
import DragElement from "./drag-element/drag-element";

import { CHECKOUT_ORDER_ERROR } from "../../services/actions/order";

import { animate, useScreenSize } from "../../services/utils";
import { useScrollbar } from "../../services/scrollbar";
import { IConstructorIngredient } from "../../services/types/data";

import {
  ADD_CONSTRUCTOR_INGREDIENT,
  REMOVE_CONSTRUCTOR_INGREDIENT,
  CLEAR_CONSTRUCTOR,
} from "../../services/actions/constructor";
import { doCheckoutOrder, CLEAR_ORDER } from "../../services/actions/order";
import styles from "./burger-constructor.module.css";

const BurgerConstructor: React.FC = () => {
  const [isOrderShown, setOrderShown] = useState(false);

  const { bunItem, items, totalPrice } = useSelector(
    (store) => store.construct
  );

  const {
    number: orderNumber,
    checkoutRequest: orderLoading,
    checkoutErrorMessage: orderError,
  } = useSelector((store) => store.order);

  const dispatch = useDispatch();

  const elementOnDelete = useCallback(
    (item: IConstructorIngredient, ref: RefObject<HTMLLIElement>) => {
      const el = ref.current;
      if (!el) {
        return;
      }
      const height = el.offsetHeight;
      el.style.zIndex = "-1";
      animate({
        draw(progress) {
          el.style.opacity = `${1 - progress}`;
          el.style.marginTop = `-${height * progress}px`;
        },
        duration: 500,
        timing: "easeOut",
      }).then(() => dispatch({ type: REMOVE_CONSTRUCTOR_INGREDIENT, item }));
    },
    [dispatch]
  );

  const orderModalOnClose = useCallback(() => {
    setOrderShown(false);
    if (orderNumber) {
      dispatch({ type: CLEAR_CONSTRUCTOR });
      dispatch({ type: CLEAR_ORDER });
    }
  }, [dispatch, orderNumber]);

  function handleCheckoutOrder() {
    setOrderShown(true);
    dispatch(doCheckoutOrder());
  }

  const [{ isOver, canDrop }, dropIngredientsRef] = useDrop(
    () => ({
      accept: "ingredient",
      drop(item, monitor) {
        dispatch({ type: ADD_CONSTRUCTOR_INGREDIENT, item });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  const listRef = useRef<HTMLUListElement>(null);
  const bottomBunRef = useRef<HTMLLIElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  useScrollbar(listRef, {
    exclude: [bottomBunRef, footerRef],
    props: [bunItem, items.length === 0],
  });

  const history = useHistory();
  const screenSize = useScreenSize();

  if (orderError === "jwt malformed") {
    dispatch({
      type: CHECKOUT_ORDER_ERROR,
      message: "",
    });
    history.replace("/login");
    return null;
  }

  return (
    <div
      className={cn(styles.container)}
      ref={dropIngredientsRef}
      data-test-id="constructor-container"
    >
      <ul className={styles.elements}>
        {!bunItem && !items.length && (
          <li
            className={cn(
              styles.dragMessage,
              "text text_type_main-medium pt-25 pb-25",
              {
                [styles.dragMessageOver]: isOver,
                text_color_inactive: !canDrop,
              }
            )}
          >
            Перетащите ингридиенты сюда
          </li>
        )}
        {bunItem && (
          <li className={styles.bunElementTop} data-test-id="ctr-bun-top">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bunItem.name} (верх)`}
              price={bunItem.price}
              thumbnail={bunItem.image}
            />
          </li>
        )}
        <li>
          <ul className={cn(styles.elementsScroll, "noselect")} ref={listRef}>
            {items.map((el, index) => {
              return (
                <DragElement
                  key={el.key}
                  item={el}
                  index={index}
                  onDelete={elementOnDelete}
                />
              );
            })}
          </ul>
        </li>
        {bunItem && (
          <li
            className={styles.bunElementBottom}
            ref={bottomBunRef}
            data-test-id="ctr-bun-bottom"
          >
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bunItem.name} (низ)`}
              price={bunItem.price}
              thumbnail={bunItem.image}
            />
          </li>
        )}
      </ul>
      <footer className={cn(styles.footer)} ref={footerRef}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <p className={cn("text", styles.footerCurrency)}>
          <CurrencyIcon type="primary" />
        </p>
        <Button
          type="primary"
          size={screenSize === "desktop" ? "large" : "small"}
          onClick={handleCheckoutOrder}
        >
          Оформить заказ
        </Button>
      </footer>
      <Modal
        header={orderError && "Ошибка"}
        visible={isOrderShown}
        onClose={orderLoading ? undefined : orderModalOnClose}
      >
        <>
          {orderLoading && (
            <div className={styles.center}>
              <p className="text text_type_main-default mb-20 ml-25 mr-25">
                Оформляем заказ...
              </p>
              <Spinner className="mb-15" />
            </div>
          )}
          {orderError && (
            <p className={cn("text text_type_main-default mt-5", styles.error)}>
              {orderError}
            </p>
          )}
          {orderNumber && <OrderDetails orderNumber={orderNumber} />}
        </>
      </Modal>
    </div>
  );
};

export default BurgerConstructor;
