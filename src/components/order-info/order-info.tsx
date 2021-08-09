import { useRef, memo, RefObject } from "react";
import cn from "classnames";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import { formatPastDate } from "../../services/utils";
import { useScrollbar } from "../../services/scrollbar";
import { translateStatus } from "../../services/orders";

import IngredientAvatar from "../ingredient-avatar/ingredient-avatar";

import { IFullOrder, IOrderIngredient } from "../../services/types/data";

import styles from "./order-info.module.css";

interface IIngredientsProps {
  ingredients: IOrderIngredient[];
  listRef: RefObject<HTMLUListElement>;
}

function Ingredients({ ingredients = [], listRef }: IIngredientsProps) {
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

interface IOrderInfoProps {
  order: IFullOrder;
  isInModal?: boolean;
}

const OrderInfo = memo(({ order, isInModal = false }: IOrderInfoProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useScrollbar(listRef, { exclude: footerRef, maxHeight: 312, isInModal });

  return (
    <section className={cn(styles.container)}>
      <h1 className="text text_type_main-medium mt-5">{order.name}</h1>
      {order.status && (
        <p
          className={cn("text text_type_main-default pt-3", {
            [styles.statusDone]: order.status === "done",
          })}
        >
          {translateStatus(order.status)}
        </p>
      )}
      <section className={cn("mt-15")}>
        <h1 className="text text_type_main-medium mb-6">Состав:</h1>
        <Ingredients ingredients={order.ingredients} listRef={listRef} />
      </section>
      <footer className={cn(styles.footer, "mt-10")} ref={footerRef}>
        <span className="text text_type_main-default text_color_inactive">
          {formatPastDate(order.createdAt)}
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

export default OrderInfo;
