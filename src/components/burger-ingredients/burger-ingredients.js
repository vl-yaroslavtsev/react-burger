import cn from "classnames";
import React from "react";
import styles from "./burger-ingredients.module.css";

function BurgerIngredients({ className }) {
  return (
    <section className={cn(styles.container, className)}>
      BurgerIngredients
    </section>
  );
}

export default BurgerIngredients;
