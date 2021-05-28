import cn from "classnames";
import React from "react";
import styles from "./burger-ingredients.module.css";

import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

function BurgerIngredients({ className }) {
  return (
    <section className={cn(styles.container, className)}>
      <h1 className="text text_type_main-large text mt-10 mb-5">
        Соберите бургер
      </h1>
      <section className={styles.tabs}>
        <Tab value="one" active={true} onClick={() => {}}>
          Булки
        </Tab>
        <Tab value="two" active={false} onClick={() => {}}>
          Соусы
        </Tab>
        <Tab value="three" active={false} onClick={() => {}}>
          Начинки
        </Tab>
      </section>
      <section className={styles.ingredients}></section>
    </section>
  );
}

export default BurgerIngredients;
