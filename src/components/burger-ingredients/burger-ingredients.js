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

const GROUP_NAME = {
  bun: "Булки",
  sauce: "Соусы",
  main: "Начинки",
};

function BurgerIngredients() {
  const [currentTab, setCurrentTab] = useState("bun");
  const [detailsShown, setDetailsShown] = useState(false);

  const dispatch = useDispatch();

  const {
    current: currentIngredient,
    items: ingredients,
    itemsErrorMessage: error,
    itemsRequest: loading,
  } = useSelector((store) => store.ingredients);

  const { items: constructorItems, bunItem } = useSelector(
    (store) => store.construct
  );

  const ingredientsRef = useRef(null);

  const counterMap = useMemo(
    () =>
      ingredients.reduce((map, item) => {
        if (bunItem && item._id === bunItem._id) {
          map[item._id] = 2;
          return map;
        }

        map[item._id] = constructorItems.filter(
          ({ _id }) => _id === item._id
        ).length;
        return map;
      }, {}),
    [ingredients, constructorItems, bunItem]
  );

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
    },
    [dispatch]
  );

  const scrollToTabSection = (tab) => {
    const el = ingredientsRef.current;
    const section = el.querySelector(`[data-group="${tab}"]`);
    el.scrollTop = section?.offsetTop;
  };

  useEffect(() => {
    const root = ingredientsRef.current;
    const height = root.offsetHeight;
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // если элемент является наблюдаемым
          if (entry.isIntersecting) {
            const section = entry.target;
            setCurrentTab(section.dataset.group);
          }
        });
      },
      {
        root,
        rootMargin: `-130px 0px ${130 - height}px 0px`,
      }
    );

    const sections = root.querySelectorAll("[data-group]");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, [ingredients]);

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
    <section className={cn(styles.container, "mr-10")}>
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
              onClick={() => scrollToTabSection(key)}
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
                              count={counterMap[item._id]}
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
          [ingredients, ingredientOnClick, counterMap]
        )}
      </ul>
      <Modal
        header="Детали ингридиента"
        visible={detailsShown}
        onClose={modalOnClose}
      >
        {currentIngredient && (
          <IngredientDetails ingredient={currentIngredient} />
        )}
      </Modal>
    </section>
  );
}

export default BurgerIngredients;
