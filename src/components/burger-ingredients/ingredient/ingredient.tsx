import styles from "./ingredient.module.css";

import { memo } from "react";
import cn from "classnames";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import { IIngredient } from "../../../services/types/data";
import LazyImage from "../../lazy-image/lazy-image";

interface IIngredientProps {
  className?: string;
  onClick?: (e: React.MouseEvent, item: IIngredient) => void;
  item: IIngredient;
  count?: number;
}

const Ingredient: React.FC<IIngredientProps> = memo(
  ({ className, item, count = 0, onClick = () => {} }) => {
    const { name, price, image } = item;
    const handleClick = (e: React.MouseEvent) => onClick(e, item);
    const [, dragRef] = useDrag(() => ({
      type: "ingredient",
      item,
    }));
    return (
      <div
        className={cn(styles.container, className)}
        onClick={handleClick}
        ref={dragRef}
        data-test-id={`ingredient-${item._id}`}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <LazyImage src={image} className={"mb-1"} alt={name} width={240} />
        <p className={cn(styles.price, "text text_type_digits-default mb-1")}>
          <span className="mr-2">{price}</span>
          <CurrencyIcon type="primary" />
        </p>
        <p className={cn(styles.title, "text text_type_main-default")}>
          {name}
        </p>
      </div>
    );
  }
);

export default Ingredient;
