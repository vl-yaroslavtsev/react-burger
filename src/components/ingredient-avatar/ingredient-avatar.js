import cn from "classnames";
import PropTypes from "prop-types";

import styles from "./ingredient-avatar.module.css";

export function IngredientAvatar({ image, count = 0 }) {
  return (
    <div className={styles.ingredient}>
      <img
        src={image}
        className={styles.ingredientImage}
        width={112}
        height={56}
      />
      {count > 0 && (
        <i className={cn(styles.ingredientFg, "text text_type_main-default")}>
          +{count}
        </i>
      )}
    </div>
  );
}

IngredientAvatar.propTypes = {
  image: PropTypes.string.isRequired,
  count: PropTypes.number,
};

export default IngredientAvatar;
