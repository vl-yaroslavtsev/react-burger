import { createContext, useReducer } from "react";

export const BurgerContext = createContext(null);

const burgerInitState = {
  topElement: null,
  elements: [],
  bottomElement: null,
  totalPrice: 0,
  orderNumber: 0,
};

function countTotalPrice({ elements = [], topElement, bottomElement }) {
  return (
    elements.reduce((prev, value) => prev + value.price, 0) +
    (topElement?.price || 0) +
    (bottomElement?.price || 0)
  );
}

function burgerReducer(state, action) {
  let newState = null;

  switch (action.type) {
    case "addElement":
      const el = action.payload;

      if (el.type === "bun") {
        newState = {
          ...state,
          topElement: {
            ...el,
            name: `${el.name} (верх)`,
          },
          bottomElement: {
            ...el,
            name: `${el.name} (низ)`,
          },
        };
      } else {
        newState = {
          ...state,
          elements: [
            ...state.elements,
            {
              ...el,
              key: el._id + new Date().getTime(),
            },
          ],
        };
      }

      newState.totalPrice = countTotalPrice(newState);
      return newState;

    case "removeElement":
      newState = {
        ...state,
        elements: state.elements.filter(
          ({ key }) => key !== action.payload.key
        ),
      };

      newState.totalPrice = countTotalPrice(newState);
      return newState;

    case "setOrder":
      return {
        ...state,
        orderNumber: action.payload,
      };

    default:
      throw new Error(`Неверный action.type: ${action.type}`);
  }
}

export function useBurgerReducer() {
  const [burgerState, burgerDispatcher] = useReducer(
    burgerReducer,
    burgerInitState
  );

  return [burgerState, burgerDispatcher];
}
