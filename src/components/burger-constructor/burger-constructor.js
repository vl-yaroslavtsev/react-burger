import { useState, useContext, useCallback } from "react";
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
import { BurgerContext } from "../../state/burgerContext";

import styles from "./burger-constructor.module.css";

const API_URL = "https://norma.nomoreparties.space/api/orders";

async function chekoutOrder(items = []) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: items }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(`${json.message}\nСтатус ответа сервера: ${res.status}`);
    }

    if (!json.success) {
      throw new Error(`${json.message}`);
    }

    return json;
  } catch (err) {
    throw new Error(
      `Что-то пошло не так. Попробуйте зайти еще раз позже.\n${err.message}`
    );
  }
}

function BurgerConstructor({ className }) {
  const [isOrderShown, setOrderShown] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  const {
    burgerDispatcher,
    burgerState: { elements, bunElement, totalPrice, orderNumber },
  } = useContext(BurgerContext);

  const elementOnDelete = (item) => {
    burgerDispatcher({ type: "removeElement", payload: item });
  };

  const orderModalOnClose = useCallback(() => {
    setOrderShown(false);
    setOrderError("");
    burgerDispatcher({
      type: "resetOrderNumber",
    });
  }, [burgerDispatcher]);

  function handleCheckoutOrder() {
    setOrderShown(true);

    if (!bunElement) {
      return setOrderError("Для оформления заказа добавьте булку!");
    }

    setOrderLoading(true);

    chekoutOrder([
      bunElement._id,
      ...elements.map((el) => el._id),
      bunElement._id,
    ])
      .then((json) => {
        burgerDispatcher({
          type: "setOrderNumber",
          payload: json.order.number,
        });
      })
      .catch((err) => setOrderError(err.message))
      .finally(() => setOrderLoading(false));
  }

  return (
    <section className={cn(styles.container, className, "pt-25 pl-4")}>
      <ul className={styles.elements}>
        {bunElement && (
          <li className="ml-8 mr-4">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bunElement.name} (верх)`}
              price={bunElement.price}
              thumbnail={bunElement.image}
            />
          </li>
        )}
        <li>
          <ul className={cn(styles.elementsScroll, "noselect pr-2")}>
            {elements.map((el) => {
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
        {bunElement && (
          <li className="ml-8 mr-4">
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bunElement.name} (низ)`}
              price={bunElement.price}
              thumbnail={bunElement.image}
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
