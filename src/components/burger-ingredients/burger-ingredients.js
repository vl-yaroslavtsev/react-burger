import styles from "./burger-ingredients.module.css";

import { useState, useRef, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

import Ingredient from "./ingredient/ingredient";
import IngredientDetails from "../ingredient-details/ingredient-details";

const GROUP_NAME = {
  bun: "Булки",
  sauce: "Соусы",
  main: "Начинки",
};

function BurgerIngredients({ className, ingredients = [] }) {
  let [currentTab, setCurrentTab] = useState("bun");
  let [detailsShown, setDetailsShown] = useState(false);
  let [currentIngredient, setCurrentIngredient] = useState(null);

  let ingredientsRef = useRef(null);

  useEffect(() => {
    const el = ingredientsRef.current;
    el.scrollTop = el.querySelector(`[data-group="${currentTab}"]`).offsetTop;
  }, [currentTab]);

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
      <ul className={cn(styles.ingredients, "mt-10")} ref={ingredientsRef}>
        {Object.entries(GROUP_NAME).map(([key, value]) => {
          return (
            <li key={key} data-group={key}>
              <h2 className="text text_type_main-medium">{value}</h2>
              <ul className={cn(styles.ingredientList, "pl-4 pr-4 pt-6 pb-2")}>
                {ingredients
                  .filter(({ type }) => type === key)
                  .map((item, index) => {
                    return (
                      <li
                        className={cn(styles.ingredient, "mb-8")}
                        key={item._id}
                        onClick={() => {
                          setCurrentIngredient(item);
                          setDetailsShown(true);
                        }}
                      >
                        <Ingredient count={index === 0 ? 1 : 0} {...item} />
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
      <IngredientDetails
        visible={detailsShown}
        onClose={() => setDetailsShown(false)}
        ingredient={currentIngredient}
      />
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
