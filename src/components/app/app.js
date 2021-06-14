import { useState, useEffect } from "react";
import styles from "./app.module.css";

import cn from "classnames";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import { BurgerContext, useBurgerReducer } from "../../state/burgerContext";

const API_URL = "https://norma.nomoreparties.space/api/ingredients";

async function loadData() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Статус ответа сервера: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(`${json.message}`);
    }

    return json.data;
  } catch (err) {
    throw new Error(
      `Что-то пошло не так. Попробуйте зайти еще раз позже.\n${err.message}`
    );
  }
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [burgerState, burgerDispatcher] = useBurgerReducer();

  useEffect(() => {
    loadData()
      .then(setData)
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={cn(styles.main, "ml-15 mr-15")}>
        {error && (
          <p className={cn(styles.error, "text text_type_main-default mt-15")}>
            {error}
          </p>
        )}
        {data && (
          <BurgerContext.Provider value={{ burgerState, burgerDispatcher }}>
            <BurgerIngredients className="mr-10" ingredients={data} />
            <BurgerConstructor />
          </BurgerContext.Provider>
        )}
      </main>
    </div>
  );
}

export default App;
