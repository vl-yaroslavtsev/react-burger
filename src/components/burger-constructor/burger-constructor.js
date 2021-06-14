import { useState, useContext } from "react";
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
import order from "../../utils/order";
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

    if (!res.ok) {
      let json = {};
      try {
        json = await res.json();
      } catch (ex) {}
      throw new Error(`${json.message}\nСтатус ответа сервера: ${res.status}`);
    }

    const json = await res.json();

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

  const {
    burgerDispatcher,
    burgerState: { elements, topElement, bottomElement, totalPrice },
  } = useContext(BurgerContext);

  const elementOnDelete = (item) => {
    burgerDispatcher({ type: "removeElement", payload: item });
  };

  function showOrderModal() {
    setOrderShown(true);
    if (!topElement) {
      return alert("Добавьте булку!");
    }
    chekoutOrder([
      topElement._id,
      ...elements.map((el) => el._id),
      bottomElement._id,
    ])
      .then((json) => alert("Заказ оформлен " + json.order.number))
      .catch((err) => alert("Ошибка" + err.message));
  }

  return (
    <section className={cn(styles.container, className, "pt-25 pl-4")}>
      <ul className={styles.elements}>
        {topElement && (
          <li className="ml-8 mr-4">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={topElement.name}
              price={topElement.price}
              thumbnail={topElement.image}
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
        {bottomElement && (
          <li className="ml-8 mr-4">
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={bottomElement.name}
              price={bottomElement.price}
              thumbnail={bottomElement.image}
            />
          </li>
        )}
      </ul>
      <footer className={cn(styles.footer, "mt-10")}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <p className="text mr-10">
          <CurrencyIcon type="primary" />
        </p>
        <Button type="primary" size="large" onClick={showOrderModal}>
          Оформить заказ
        </Button>
      </footer>
      <Modal visible={isOrderShown} onClose={() => setOrderShown(false)}>
        <OrderDetails order={order} />
      </Modal>
    </section>
  );
}

BurgerConstructor.propTypes = {
  className: PropTypes.string,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.number,
    })
  ),
};

export default BurgerConstructor;
