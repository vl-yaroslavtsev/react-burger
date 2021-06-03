import { useState, useEffect } from "react";
import cn from "classnames";
import Modal from "../modal/modal";

import styles from "./ingredient-details.module.css";

function useImagePreloader(src) {
  const [isLoading, setLoading] = useState(true);

  const preloadImage = async (src) => {
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
      preloadImage(src).then(() => setLoading(false));
    }
  }, [src]);

  return isLoading;
}

function IngredientDetails({ ingredient, visible, onClose = () => {} }) {
  const imageLoading = useImagePreloader(ingredient?.image_large);

  return (
    ingredient && (
      <Modal header="Детали ингридиента" visible={visible} onClose={onClose}>
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
      </Modal>
    )
  );
}

export default IngredientDetails;
