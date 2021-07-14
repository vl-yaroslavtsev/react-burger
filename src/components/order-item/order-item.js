import { useState, useEffect, memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./order-item.module.css";

function Ingredients({ ingredients = [] }) {
  const list = ingredients.slice(0, 5);
  const rest = ingredients.slice(5);
  return (
    <ul className={styles.ingredientList}>
      {list.map(({ image }, index) => (
        <li
          className={styles.ingredient}
          key={index}
          style={{ zIndex: list.length - index }}
        >
          <img
            src={image}
            className={styles.ingredientImage}
            width={112}
            height={56}
          />
        </li>
      ))}
      {rest.length > 0 && (
        <li className={styles.ingredient} key={list.length}>
          <img
            src={rest[0].image}
            className={styles.ingredientImage}
            width={112}
            height={56}
          />
          {rest.length > 1 && (
            <i
              className={cn(styles.ingredientFg, "text text_type_main-default")}
            >
              +{rest.length}
            </i>
          )}
        </li>
      )}
    </ul>
  );
}

function formatDate(date) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  date = new Date(date);
  const timezone = date.getHours() - date.getUTCHours();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  let past = "";

  if (date > today * 1 + 24 * 3600 * 1000) {
    past = date.toLocaleDateString();
  } else if (date > today) {
    past = "Сегодня";
  } else if (date > today - 24 * 3600 * 1000) {
    past = "Вчера";
  } else {
    const days = Math.ceil((today - date) / (24 * 3600 * 1000));
    past = `${days} дня назад`;
  }

  return `${past}, ${hours}:${minutes} i-GMT${
    timezone > 0 ? "+" : ""
  }${timezone}`;
}

const OrderItem = memo(({ order }) => {
  return (
    <div className={cn(styles.container, "pl-6 pr-6 pb-6 pt-6")}>
      <header className={styles.header}>
        <h2 className="text text_type_digits-default">#{order.number}</h2>
        <span className="text text_type_main-default text_color_inactive">
          {formatDate(order.date)}
        </span>
      </header>
      <h1 className="text text_type_main-medium mt-6">{order.name}</h1>
      {order.status && (
        <p
          className={cn("text text_type_main-default pt-2", {
            [styles.statusDone]: order.status === "Выполнен",
          })}
        >
          {order.status}
        </p>
      )}
      <footer className={cn(styles.footer, "mt-6")}>
        <Ingredients ingredients={order.ingredients} />
        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{order.price}</p>
          <p className="text">
            <CurrencyIcon type="primary" />
          </p>
        </div>
      </footer>
    </div>
  );
});

OrderItem.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    price: PropTypes.number,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default OrderItem;
