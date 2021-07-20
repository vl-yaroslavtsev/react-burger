import { useLayoutEffect, memo } from "react";
import cn from "classnames";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import IngredientDetails from "../components/ingredient-details/ingredient-details";

import {
  getIngredients,
} from "../services/actions/ingredients";

import styles from "./ingredient.module.css";

const Skeleton = memo(() => {
  return (<div>
    <h1 style={{ width: "80%" }}
      className={cn(styles.skeleton, "text text_type_main-large")}>&nbsp;</h1>
    <div style={{ width: 480, height: 240 }} className={cn(styles.skeleton, "mt-4")}></div>
    <div style={{ height: 30 }} className={cn(styles.skeleton, "mt-8")}></div>
    <div style={{ height: 30 }} className={cn(styles.skeleton, "mt-4")}></div>
    <div style={{ height: 30 }} className={cn(styles.skeleton, "mt-4")}></div>
  </div>);
});

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
      {loading && <Skeleton />}
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
