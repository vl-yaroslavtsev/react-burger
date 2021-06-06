import { useState, useEffect, memo } from "react";
import cn from "classnames";
import PropTypes from "prop-types";

import styles from "./ingredient-details.module.css";

function useImageLoading(src) {
  const [isLoading, setLoading] = useState(true);

  const loadImage = async (src) => {
    if (!src) return;
    var img = new Image();
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

const IngredientDetails = memo(({ ingredient = null }) => {
  const imageLoading = useImageLoading(ingredient?.image_large);

  return (
    ingredient && (
      <div className={cn(styles.container, "pl-15 pr-15 pb-5")}>
        {imageLoading && <div className={styles.imagePreloader}></div>}
        <img
          className={cn(styles.image, {
            [styles.hidden]: imageLoading,
          })}
          src={ingredient.image_large}
          alt={ingredient.name}
        />
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
    )
  );
});

IngredientDetails.propTypes = {
  ingredient: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.number,
  }),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default IngredientDetails;
