import styles from "./ingredient.module.css";

import { memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";

const Ingredient = memo(
  ({ className, item, count = 0, onClick = () => {} }) => {
    const { name, price, image } = item;
    const handleClick = (e) => onClick(e, item);
    const [, dragRef] = useDrag({
      type: "ingredient",
      item,
    });
    return (
      <section
        className={cn(styles.container, className)}
        onClick={handleClick}
        ref={dragRef}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <img src={image} className="mb-1" alt={name} />
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

Ingredient.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
  }),
  count: PropTypes.number,
};

export default Ingredient;
