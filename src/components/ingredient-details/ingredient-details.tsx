import { useState, useEffect, memo } from "react";
import cn from "classnames";

import styles from "./ingredient-details.module.css";
import { IIngredient } from "../../services/types/data";
import LazyImage from "../lazy-image/lazy-image";

interface IngredientDetailsProps {
  ingredient: IIngredient;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = memo(
  ({ ingredient }) => {
    return (
      <div className={cn(styles.container, "pl-15 pr-15 pb-5")}>
        <LazyImage
          src={ingredient.image_large}
          alt={ingredient.name}
          width={480}
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
    );
  }
);

export default IngredientDetails;
