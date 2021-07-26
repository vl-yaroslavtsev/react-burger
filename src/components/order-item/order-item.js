import { memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import { Link, useRouteMatch, useLocation } from "react-router-dom";
import { formatPastDate } from "../../services/utils";
import IngredientAvatar from "../ingredient-avatar/ingredient-avatar";

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
          <IngredientAvatar image={image} />
        </li>
      ))}
      {rest.length > 0 && (
        <li className={styles.ingredient} key={list.length}>
          <IngredientAvatar image={rest[0].image} count={rest.length - 1} />
        </li>
      )}
    </ul>
  );
}

const OrderItem = memo(({ order }) => {
  const location = useLocation();
  const { path } = useRouteMatch();
  return (
    <Link
      className={cn(styles.container, "pl-6 pr-6 pb-6 pt-6")}
      to={{
        pathname: `${path}/${order.number}`,
        state: { background: location },
      }}
    >
      <header className={styles.header}>
        <h2 className="text text_type_digits-default">#{order.number}</h2>
        <span className="text text_type_main-default text_color_inactive">
          {formatPastDate(order.date)}
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
    </Link>
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
