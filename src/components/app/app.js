import styles from "./app.module.css";

import cn from "classnames";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";

import data from "../../utils/data";

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={cn(styles.main, "ml-15 mr-15")}>
        <BurgerIngredients className="mr-10" />
        <BurgerConstructor />
      </main>
    </div>
  );
}

export default App;
