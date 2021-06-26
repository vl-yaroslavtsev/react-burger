import styles from "./burger-ingredients.module.css";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";
import PropTypes from "prop-types";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

import Modal from "../modal/modal";
import Ingredient from "./ingredient/ingredient";
import IngredientDetails from "../ingredient-details/ingredient-details";
import {
  getIngredients,
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
} from "../../services/actions/ingredients";

import { ADD_CONSTRUCTOR_INGREDIENT } from "../../services/actions/constructor";

const GROUP_NAME = {
  bun: "Булки",
  sauce: "Соусы",
  main: "Начинки",
};

function BurgerIngredients({ className }) {
  let [currentTab, setCurrentTab] = useState("bun");
  let [detailsShown, setDetailsShown] = useState(false);

  const dispatch = useDispatch();

  const {
    current: currentIngredient,
    items: ingredients,
    itemsErrorMessage: error,
    itemsRequest: loading,
  } = useSelector((store) => store.ingredients);

  let ingredientsRef = useRef(null);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const modalOnClose = useCallback(() => {
    setDetailsShown(false);
    dispatch({ type: CLEAR_CURRENT_INGREDIENT });
  }, [dispatch]);

  const ingredientOnClick = useCallback(
    (e, item) => {
      dispatch({ type: SET_CURRENT_INGREDIENT, current: item });
      setDetailsShown(true);
      dispatch({ type: ADD_CONSTRUCTOR_INGREDIENT, item });
    },
    [dispatch]
  );

  useEffect(() => {
    const el = ingredientsRef.current;
    el.scrollTop = el.querySelector(`[data-group="${currentTab}"]`)?.offsetTop;
  }, [currentTab]);

  const skeleton = useMemo(
    () => (
      <ul className={cn(styles.ingredients, "mt-10")}>
        <li>
          <h2 className="text text_type_main-medium">
            <div className={styles.skeleton} style={{ width: 100 }}>
              &nbsp;
            </div>
          </h2>
          <ul className={cn(styles.ingredientList, "pl-4 pr-4 pt-6 pb-2")}>
            {[...Array(2)].map((item, index) => {
              return (
                <li className={cn(styles.ingredient, "mb-8 mt-4")} key={index}>
                  <div className={styles.skeleton} style={{ height: 200 }}>
                    &nbsp;
                  </div>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    ),
    []
  );

  return (
    <section className={cn(styles.container, className)}>
      <h1 className="text text_type_main-large text mt-10 mb-5">
        Соберите бургер
      </h1>
      <section className={styles.tabs}>
        {Object.entries(GROUP_NAME).map(([key, value]) => {
          return (
            <Tab
              key={key}
              value={key}
              active={key === currentTab}
              onClick={() => setCurrentTab(key)}
            >
              {value}
            </Tab>
          );
        })}
      </section>
      {error && (
        <p className={cn(styles.error, "text text_type_main-default mt-15")}>
          {error}
        </p>
      )}
      {loading && skeleton}
      <ul className={cn(styles.ingredients, "mt-10")} ref={ingredientsRef}>
        {useMemo(
          () =>
            ingredients.length > 0 &&
            Object.entries(GROUP_NAME).map(([key, value]) => {
              return (
                <li key={key} data-group={key}>
                  <h2 className="text text_type_main-medium">{value}</h2>
                  <ul
                    className={cn(styles.ingredientList, "pl-4 pr-4 pt-6 pb-2")}
                  >
                    {ingredients
                      .filter(({ type }) => type === key)
                      .map((item, index) => {
                        return (
                          <li
                            className={cn(styles.ingredient, "mb-8")}
                            key={item._id}
                          >
                            <Ingredient
                              count={index === 0 ? 1 : 0}
                              onClick={ingredientOnClick}
                              item={item}
                            />
                          </li>
                        );
                      })}
                  </ul>
                </li>
              );
            }),
          [ingredients, ingredientOnClick]
        )}
      </ul>
      <Modal
        header="Детали ингридиента"
        visible={detailsShown}
        onClose={modalOnClose}
      >
        <IngredientDetails ingredient={currentIngredient} />
      </Modal>
    </section>
  );
}

BurgerIngredients.propTypes = {
  className: PropTypes.string,
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.number,
    })
  ),
};

export default BurgerIngredients;
