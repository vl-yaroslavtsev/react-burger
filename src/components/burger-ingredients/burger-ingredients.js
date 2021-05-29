import styles from "./burger-ingredients.module.css";

import { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

import Ingredient from "./ingredient/ingredient";

const GROUP_NAME = {
  bun: "Булки",
  sauce: "Соусы",
  main: "Начинки",
};

function BurgerIngredients({ className, ingredients = [] }) {
  let [currentTab, setCurrentTab] = useState("bun");
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
      <section className={cn(styles.ingredients, "mt-10")}>
        {Object.entries(GROUP_NAME).map(([key, value]) => {
          return (
            <section
              key={key}
              className={cn({ [styles.hidden]: key !== currentTab })}
            >
              <h2 className="text text_type_main-medium">{value}</h2>
              <section
                className={cn(styles.ingredientList, "pl-4 pr-4 pt-6 pb-2")}
              >
                {ingredients
                  .filter(({ type }) => type === key)
                  .map((item, index) => {
                    return (
                      <Ingredient
                        key={item._id}
                        className={cn(styles.ingredient, "mb-8")}
                        count={index === 0 ? 1 : 0}
                        {...item}
                      />
                    );
                  })}
              </section>
            </section>
          );
        })}
      </section>
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
