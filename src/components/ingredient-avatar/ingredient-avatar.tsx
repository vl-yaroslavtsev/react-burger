import cn from "classnames";

import styles from "./ingredient-avatar.module.css";

interface IIngredientAvatarProps {
  image: string;
  count?: number;
}

export function IngredientAvatar({ image, count = 0 }: IIngredientAvatarProps) {
  return (
    <div className={styles.ingredient}>
      <img
        src={image}
        className={styles.ingredientImage}
        width={112}
        height={56}
        alt="ingredient"
      />
      {count > 0 && (
        <i className={cn(styles.ingredientFg, "text text_type_main-default")}>
          +{count}
        </i>
      )}
    </div>
  );
}

export default IngredientAvatar;
