import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_ERROR,
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
} from "../actions/ingredients";

const ingredientsState = {
  items: [],
  itemsRequest: false,
  itemsSuccess: false,
  itemsErrorMessage: "",
  current: null,
};

export const ingredientsReducer = (state = ingredientsState, action) => {
  switch (action.type) {
    case GET_INGREDIENTS_REQUEST:
      return { ...state, itemsRequest: true };

    case GET_INGREDIENTS_SUCCESS:
      return {
        ...state,
        itemsRequest: false,
        itemsSuccess: true,
        itemsErrorMessage: "",
        items: action.items,
      };

    case GET_INGREDIENTS_ERROR:
      return {
        ...state,
        itemsRequest: false,
        itemsSuccess: false,
        itemsErrorMessage: action.message,
        items: [],
      };

    case SET_CURRENT_INGREDIENT:
      return { ...state, current: action.current };

    case CLEAR_CURRENT_INGREDIENT:
      return { ...state, current: null };

    default:
      return state;
  }
};
