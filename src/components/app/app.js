import styles from "./app.module.css";

import cn from "classnames";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import { BurgerContext } from "../../state/burgerContext";
import { useBurgerReducer } from "../../state/burgerState";

function App() {
  const [burgerState, burgerDispatcher] = useBurgerReducer();

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={cn(styles.main, "ml-15 mr-15")}>
        <BurgerContext.Provider value={{ burgerState, burgerDispatcher }}>
          <BurgerIngredients className="mr-10" />
          <BurgerConstructor />
        </BurgerContext.Provider>
      </main>
    </div>
  );
}

export default App;
