import styles from "./ingredient.module.css";

import { memo } from "react";
import cn from "classnames";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import { IIngredient } from "../../../services/types/data";

interface IIngredientProps {
  className?: string;
  onClick?: (e: React.MouseEvent, item: IIngredient) => void;
  item: IIngredient;
  count?: number;
}

const Ingredient = memo(
  ({ className, item, count = 0, onClick = () => {} }: IIngredientProps) => {
    const { name, price, image } = item;
    const handleClick = (e: React.MouseEvent) => onClick(e, item);
    const [, dragRef] = useDrag({
      type: "ingredient",
      item,
    });
    return (
      <section
        className={cn(styles.container, className)}
        onClick={handleClick}
        ref={dragRef}
        data-test-id={`ingredient-${item._id}`}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <img src={image} width={240} height={120} className="mb-1" alt={name} />
        <p className={cn(styles.price, "text text_type_digits-default mb-1")}>
          <span className="mr-2">{price}</span>
          <CurrencyIcon type="primary" />
        </p>
        <p className={cn(styles.title, "text text_type_main-default")}>
          {name}
        </p>
      </section>
    );
  }
);

export default Ingredient;
