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
  const topElement = elements.find(
    ({ _id }) => _id === "60666c42cc7b410027a1a9b1"
  );
  return (
    <section className={cn(styles.container, className, "mt-25")}>
      <section className={cn(styles.elements, "pl-8")}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={topElement.name + " (верх)"}
          price={topElement.price}
          thumbnail={topElement.image}
        />
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={topElement.name + " (низ)"}
          price={topElement.price}
          thumbnail={topElement.image}
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
