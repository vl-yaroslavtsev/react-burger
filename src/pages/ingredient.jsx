import { useLayoutEffect, memo } from "react";
import cn from "classnames";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import Skeleton from "../components/skeleton/skeleton";
import IngredientDetails from "../components/ingredient-details/ingredient-details";

import {
  getIngredients,
} from "../services/actions/ingredients";

import styles from "./ingredient.module.css";

const skeleton = (<div>
  <Skeleton width="80%" className="text text_type_main-large" />
  <Skeleton width={480} height={240} className="mt-4 mb-8" />
  <Skeleton height={30} className="mt-4" repeat={3} />
</div>);
export function IngredientPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    items: ingredients,
    itemsErrorMessage: error,
    itemsRequest: loading,
  } = useSelector((store) => store.ingredients);

  useLayoutEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, [ingredients.length, dispatch]);

  const ingredient = ingredients.find(({ _id }) => _id === id);
  return (
    <section className={cn(styles.container)}>
      {loading && skeleton}
      {error && <p className={cn(styles.error, "text text_type_main-default")}>
        Ошибка загрузки данных. {error}
      </p>}
      {ingredient && <>
        <h1 className="text text_type_main-large">Детали ингридиента</h1>
        <IngredientDetails ingredient={ingredient} />
      </>}
      {
        !error && !loading && !ingredient && <p className="text text_type_main-default">
          Увы, не удалось найти ингридиент.
        </p>
      }
    </section >
  );
}
