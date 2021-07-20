import styles from "./burger-ingredients.module.css";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Route,
  useLocation,
  useHistory,
  Link,
  useParams,
} from "react-router-dom";
import cn from "classnames";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

import Modal from "../modal/modal";
import Ingredient from "./ingredient/ingredient";
import IngredientDetails from "../ingredient-details/ingredient-details";
import { animate, useScrollbar } from "../../services/utils";
import { getIngredients } from "../../services/actions/ingredients";

const GROUP_NAME = {
  bun: "Булки",
  sauce: "Соусы",
  main: "Начинки",
};

function BurgerIngredients() {
  const [currentTab, setCurrentTab] = useState("bun");

  const dispatch = useDispatch();
  const location = useLocation();

  const {
    items: ingredients,
    itemsErrorMessage: error,
    itemsRequest: loading,
  } = useSelector((store) => store.ingredients);

  const { items: constructorItems, bunItem } = useSelector(
    (store) => store.construct
  );

  const ingredientsRef = useRef(null);
  useScrollbar(ingredientsRef);

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

  useLayoutEffect(() => {
    if (ingredients.length === 0) {
      dispatch(getIngredients());
    }
  }, []);

  const scrollToTabSection = (tab) => {
    const el = ingredientsRef.current;
    const section = el.querySelector(`[data-group="${tab}"]`);
    const startScroll = el.scrollTop;
    const endScroll = section?.offsetTop;

    animate({
      draw(progress) {
        el.scrollTop = startScroll + (endScroll - startScroll) * progress;
      },
      duration: 400,
    });
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
                            <Link
                              to={{
                                pathname: `/ingredients/${item._id}`,
                                state: { background: location },
                              }}
                            >
                              <Ingredient
                                count={counterMap[item._id]}
                                item={item}
                              />
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </li>
              );
            }),
          [ingredients, counterMap]
        )}
      </ul>
    </section>
  );
}

export default BurgerIngredients;
