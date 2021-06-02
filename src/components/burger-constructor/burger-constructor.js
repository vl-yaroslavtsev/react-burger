import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";

import styles from "./burger-constructor.module.css";

import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function BurgerConstructor({ className, elements = [] }) {
  const lockedElement = elements.find(
    ({ _id }) => _id === "60b646daabc9290027b206d7"
  );
  const freeElements = elements.filter(({ type }) => type !== "bun");
  return (
    <section className={cn(styles.container, className, "pt-25 pl-4")}>
      <section className={cn(styles.elements, "pl-8")}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={lockedElement.name + " (верх)"}
          price={lockedElement.price}
          thumbnail={lockedElement.image}
        />
        <ul className={styles.elementsScroll}>
          {freeElements.map((el) => {
            return (
              <li key={el._id}>
                <ConstructorElement
                  text={el.name}
                  price={el.price}
                  thumbnail={el.image}
                />
              </li>
            );
          })}
        </ul>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={lockedElement.name + " (низ)"}
          price={lockedElement.price}
          thumbnail={lockedElement.image}
        />
      </section>
      <footer className={cn(styles.footer, "mt-10")}>
        <p className="text text_type_digits-medium mr-2">610</p>
        <p className="text mr-10">
          <CurrencyIcon type="primary" />
        </p>
        <Button type="primary" size="large">
          Оформить заказ
        </Button>
      </footer>
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
