import { memo } from "react";
import cn from "classnames";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import { Link, useRouteMatch, useLocation } from "react-router-dom";
import { formatPastDate, getScreenSize } from "../../services/utils";
import IngredientAvatar from "../ingredient-avatar/ingredient-avatar";
import { IFullOrder, IOrderIngredient } from "../../services/types/data";
import { translateStatus } from "../../services/orders";

import styles from "./order-item.module.css";

interface IIngredientsProps {
  ingredients: IOrderIngredient[];
}

const Ingredients: React.FC<IIngredientsProps> = ({ ingredients = [] }) => {
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
};

interface IOrderItemProps {
  order: IFullOrder;
}

const OrderItem: React.FC<IOrderItemProps> = memo(({ order }) => {
  const location = useLocation();
  const { path } = useRouteMatch();
  return (
    <Link
      className={cn(styles.container)}
      to={{
        pathname: `${path}/${order.number}`,
        state: { background: location },
      }}
    >
      <header className={styles.header}>
        <h2 className="text text_type_digits-default mr-4">#{order.number}</h2>
        <span className="text text_type_main-default text_color_inactive">
          {formatPastDate(order.createdAt)}
        </span>
      </header>
      <h1 className={cn("text text_type_main-medium", styles.title)}>
        {order.name}
      </h1>
      {order.status && (
        <p
          className={cn("text text_type_main-default pt-2 tablet-hidden", {
            [styles.statusDone]: order.status === "done",
          })}
        >
          {translateStatus(order.status)}
        </p>
      )}
      <footer className={cn(styles.footer)}>
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

export default OrderItem;
