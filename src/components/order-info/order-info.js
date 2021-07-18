import { useRef, memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import { formatPastDate, useScrollbar } from "../../services/utils";
import IngredientAvatar from "../ingredient-avatar/ingredient-avatar";

import styles from "./order-info.module.css";

function Ingredients({ ingredients = [], listRef }) {
  return (
    <ul className={styles.ingredientList} ref={listRef}>
      {ingredients.map(({ image, name, count, price }, index) => (
        <li className={cn(styles.ingredient, "mb-4 mr-6")} key={index}>
          <IngredientAvatar image={image} />
          <p
            className={cn(
              styles.ingredientName,
              "text text_type_main-default ml-4"
            )}
          >
            {name}
          </p>
          <div className={styles.price}>
            <p className="text text_type_digits-default mr-2">
              {count} x {price}
            </p>
            <p className="text">
              <CurrencyIcon type="primary" />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const OrderInfo = memo(({ order }) => {
  const listRef = useRef();
  const footerRef = useRef();
  useScrollbar(listRef, { exclude: footerRef, maxHeight: 312 });
  return (
    <section className={cn(styles.container)}>
      <h2 className={cn(styles.number, "text text_type_digits-default mt-2")}>
        #{order.number}
      </h2>
      <h1 className="text text_type_main-medium mt-10">{order.name}</h1>
      {order.status && (
        <p
          className={cn("text text_type_main-default pt-3", {
            [styles.statusDone]: order.status === "Выполнен",
          })}
        >
          {order.status}
        </p>
      )}
      <section className={cn(styles.content, "mt-15")}>
        <h1 className="text text_type_main-medium mb-6">Состав:</h1>
        <Ingredients ingredients={order.ingredients} listRef={listRef} />
      </section>
      <footer className={cn(styles.footer, "mt-10 mb-2")} ref={footerRef}>
        <span className="text text_type_main-default text_color_inactive">
          {formatPastDate(order.date)}
        </span>
        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{order.price}</p>
          <p className="text">
            <CurrencyIcon type="primary" />
          </p>
        </div>
      </footer>
    </section>
  );
});

OrderInfo.propTypes = {
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

export default OrderInfo;
