import styles from "./ingredient.module.css";

import React from "react";
import cn from "classnames";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

function Ingredient({ className, name, price, image, count = 0 }) {
  return (
    <section className={cn(styles.container, className)}>
      {count ? <Counter count={count} size="default" /> : null}
      <img src={image} className="mb-1" alt={name} />
      <p className={cn(styles.price, "text text_type_digits-default mb-1")}>
        <span className="mr-2">{price}</span>
        <CurrencyIcon type="primary" />
      </p>
      <p className={cn(styles.title, "text text_type_main-default")}>{name}</p>
    </section>
  );
}

export default Ingredient;
