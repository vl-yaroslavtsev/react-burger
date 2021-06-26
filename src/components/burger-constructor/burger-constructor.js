import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import PropTypes from "prop-types";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

import OrderDetails from "../order-details/order-details";
import Modal from "../modal/modal";

import { REMOVE_CONSTRUCTOR_INGREDIENT } from "../../services/actions/constructor";
import { doCheckoutOrder } from "../../services/actions/order";
import styles from "./burger-constructor.module.css";

function BurgerConstructor({ className }) {
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

  const elementOnDelete = (item) => {
    dispatch({ type: REMOVE_CONSTRUCTOR_INGREDIENT, item });
  };

  const orderModalOnClose = useCallback(() => {
    setOrderShown(false);
  }, []);

  function handleCheckoutOrder() {
    setOrderShown(true);
    dispatch(doCheckoutOrder());
  }

  return (
    <section className={cn(styles.container, className, "pt-25 pl-4")}>
      <ul className={styles.elements}>
        {bunItem && (
          <li className="ml-8 mr-4">
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
          <ul className={cn(styles.elementsScroll, "noselect pr-2")}>
            {items.map((el) => {
              return (
                <li key={el.key} className={styles.elementsScrollItem}>
                  <i className={cn(styles.dragItem, "mr-2")}>
                    <DragIcon type="primary" />
                  </i>
                  <ConstructorElement
                    text={el.name}
                    price={el.price}
                    thumbnail={el.image}
                    handleClose={() => elementOnDelete(el)}
                  />
                </li>
              );
            })}
          </ul>
        </li>
        {bunItem && (
          <li className="ml-8 mr-4">
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
      <footer className={cn(styles.footer, "mt-10")}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <p className="text mr-10">
          <CurrencyIcon type="primary" />
        </p>
        <Button type="primary" size="large" onClick={handleCheckoutOrder}>
          Оформить заказ
        </Button>
      </footer>
      <Modal
        header={orderError && "Ошибка"}
        visible={isOrderShown}
        onClose={orderModalOnClose}
      >
        <>
          {orderLoading && (
            <p className="text text_type_main-default">Отправка заказа...</p>
          )}
          {orderError && (
            <p className={cn("text text_type_main-default", styles.error)}>
              {orderError}
            </p>
          )}
          {orderNumber && <OrderDetails orderNumber={orderNumber} />}
        </>
      </Modal>
    </section>
  );
}

BurgerConstructor.propTypes = {
  className: PropTypes.string,
};

export default BurgerConstructor;
