import {
  ADD_CONSTRUCTOR_INGREDIENT,
  REMOVE_CONSTRUCTOR_INGREDIENT,
  REORDER_CONSTRUCTOR_INGREDIENTS,
} from "../actions/constructor";

function countTotalPrice(items = [], bunItem) {
  return (
    items.reduce((prev, value) => prev + value.price, 0) +
    (bunItem?.price || 0) * 2
  );
}

const constructorState = {
  items: [],
  bunItem: null,
  totalPrice: 0,
};
export const constructorReducer = (state = constructorState, action) => {
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
      let items = state.items;
      const drag = items[action.dragIndex];

      return {
        ...state,
        items: [
          ...items
            .slice(0, action.hoverIndex + 1)
            .filter(({ key }) => key !== drag.key),
          drag,
          ...items
            .slice(action.hoverIndex + 1)
            .filter(({ key }) => key !== drag.key),
        ],
      };
    }

    default:
      return state;
  }
};
