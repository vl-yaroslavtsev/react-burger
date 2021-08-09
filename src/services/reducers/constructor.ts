import {
  ADD_CONSTRUCTOR_INGREDIENT,
  REMOVE_CONSTRUCTOR_INGREDIENT,
  REORDER_CONSTRUCTOR_INGREDIENTS,
  CLEAR_CONSTRUCTOR,
} from "../actions/constructor";

import { TConstructorActions } from "../actions/constructor";
import { IIngredient, IConstructorIngredient } from "../types/data";

function countTotalPrice(
  items: IConstructorIngredient[] = [],
  bunItem: IIngredient | null
) {
  return (
    items.reduce((prev, value) => prev + value.price, 0) +
    (bunItem?.price || 0) * 2
  );
}

export interface IConstructorState {
  items: IConstructorIngredient[];
  bunItem: IIngredient | null;
  totalPrice: number;
}

const constructorState: IConstructorState = {
  items: [],
  bunItem: null,
  totalPrice: 0,
};

export const constructorReducer = (
  state: IConstructorState = constructorState,
  action: TConstructorActions
) => {
  switch (action.type) {
    case ADD_CONSTRUCTOR_INGREDIENT:
      const item = action.item;

      if (item.type === "bun") {
        return {
          ...state,
          bunItem: item,
          totalPrice: countTotalPrice(state.items, item),
        };
      } else {
        const items = [
          ...state.items,
          {
            ...item,
            key: item._id + new Date().getTime(),
          },
        ];
        return {
          ...state,
          items,
          totalPrice: countTotalPrice(items, state.bunItem),
        };
      }

    case REMOVE_CONSTRUCTOR_INGREDIENT:
      const items = state.items.filter(({ key }) => key !== action.item.key);
      return {
        ...state,
        items,
        totalPrice: countTotalPrice(items, state.bunItem),
      };

    case REORDER_CONSTRUCTOR_INGREDIENTS: {
      const items = state.items;
      const dropItem = items[action.dropIndex];

      return {
        ...state,
        items: [
          ...items
            .slice(0, action.hoverIndex + 1)
            .filter(({ key }) => key !== dropItem.key),
          dropItem,
          ...items
            .slice(action.hoverIndex + 1)
            .filter(({ key }) => key !== dropItem.key),
        ],
      };
    }

    case CLEAR_CONSTRUCTOR:
      return constructorState;

    default:
      return state;
  }
};
