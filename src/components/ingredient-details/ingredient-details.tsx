import { useState, useEffect, memo } from "react";
import cn from "classnames";

import styles from "./ingredient-details.module.css";
import { IIngredient } from "../../services/types/data";

function useImageLoading(src: string) {
  const [isLoading, setLoading] = useState(true);

  const loadImage = async (src: string) => {
    if (!src) return;
    const img = new Image();
    img.src = src;

    return new Promise((resolve, reject) => {
      img.onload = () => resolve(src);
      img.onerror = reject;
    });
  };

  useEffect(() => {
    setLoading(true);
    if (src) {
      loadImage(src).then(() => setLoading(false));
    }
  }, [src]);

  return isLoading;
}

interface IngredientDetailsProps {
  ingredient: IIngredient;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = memo(
  ({ ingredient }) => {
    const imageLoading = useImageLoading(ingredient.image_large);

    return (
      <div className={cn(styles.container, "pl-15 pr-15 pb-5")}>
        {imageLoading ? (
          <div className={styles.imagePreloader}></div>
        ) : (
          <img
            className={styles.image}
            src={ingredient.image_large}
            alt={ingredient.name}
          />
        )}
        <h1
          className={cn(styles.title, "text text_type_main-medium mt-4 mb-8")}
        >
          {ingredient.name}
        </h1>
        <dl className={cn(styles.content, "text text_type_main-default")}>
          <div>
            <dt>Калории, ккал</dt>
            <dd className="text text_type_digits-default mt-2">
              {ingredient.calories}
            </dd>
          </div>
          <div>
            <dt>Белки, г</dt>
            <dd className="text text_type_digits-default mt-2">
              {ingredient.proteins}
            </dd>
          </div>
          <div>
            <dt>Жиры, г</dt>
            <dd className="text text_type_digits-default mt-2">
              {ingredient.fat}
            </dd>
          </div>
          <div>
            <dt>Углеводы, г</dt>
            <dd className="text text_type_digits-default mt-2">
              {ingredient.carbohydrates}
            </dd>
          </div>
        </dl>
      </div>
    );
  }
);

export default IngredientDetails;