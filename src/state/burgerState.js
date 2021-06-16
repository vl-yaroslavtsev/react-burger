import { useReducer } from "react";

const burgerInitState = {
  elements: [],
  bunElement: null,
  totalPrice: 0,
  orderNumber: null,
};

function countTotalPrice(elements = [], bunElement) {
  return (
    elements.reduce((prev, value) => prev + value.price, 0) +
    (bunElement?.price || 0) * 2
  );
}

function burgerReducer(state, action) {
  switch (action.type) {
    case "addElement":
      const el = action.payload;

      if (el.type === "bun") {
        return {
          ...state,
          bunElement: el,
          totalPrice: countTotalPrice(state.elements, el),
        };
      } else {
        const elements = [
          ...state.elements,
          {
            ...el,
            key: el._id + new Date().getTime(),
          },
        ];
        return {
          ...state,
          elements,
          totalPrice: countTotalPrice(elements, state.bunElement),
        };
      }

    case "removeElement":
      const elements = state.elements.filter(
        ({ key }) => key !== action.payload.key
      );
      return {
        ...state,
        elements,
        totalPrice: countTotalPrice(elements, state.bunElement),
      };

    case "setOrderNumber":
      return {
        ...state,
        orderNumber: action.payload,
      };

    case "resetOrderNumber":
      return {
        ...state,
        orderNumber: null,
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
