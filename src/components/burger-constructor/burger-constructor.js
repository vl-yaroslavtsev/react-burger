import { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import OrderDetails from "../order-details/order-details";
import order from "../../utils/order";

import styles from "./burger-constructor.module.css";

import {
  ConstructorElement,
  Button,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function BurgerConstructor({ className, elements = [] }) {
  const [isOrderShown, setOrderShown] = useState(false);

  const lockedElement = elements.find(({ type }) => type === "bun");
  const freeElements = elements.filter(({ type }) => type !== "bun");
  return (
    <section className={cn(styles.container, className, "pt-25 pl-4")}>
      <ul className={styles.elements}>
        <li className="ml-8 mr-4">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={lockedElement.name + " (верх)"}
            price={lockedElement.price}
            thumbnail={lockedElement.image}
          />
        </li>
        <li>
          <ul className={cn(styles.elementsScroll, "noselect pr-2")}>
            {freeElements.map((el) => {
              return (
                <li key={el._id} className={styles.elementsScrollItem}>
                  <i className={cn(styles.dragItem, "mr-2")}>
                    <DragIcon type="primary" />
                  </i>
                  <ConstructorElement
                    text={el.name}
                    price={el.price}
                    thumbnail={el.image}
                  />
                </li>
              );
            })}
          </ul>
        </li>
        <li className="ml-8">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={lockedElement.name + " (низ)"}
            price={lockedElement.price}
            thumbnail={lockedElement.image}
          />
        </li>
      </ul>
      <footer className={cn(styles.footer, "mt-10")}>
        <p className="text text_type_digits-medium mr-2">610</p>
        <p className="text mr-10">
          <CurrencyIcon type="primary" />
        </p>
        <Button type="primary" size="large" onClick={() => setOrderShown(true)}>
          Оформить заказ
        </Button>
      </footer>
      <OrderDetails
        order={order}
        visible={isOrderShown}
        onClose={() => setOrderShown(false)}
      />
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
