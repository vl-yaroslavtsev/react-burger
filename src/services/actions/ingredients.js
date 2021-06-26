import { loadIngredients } from "../api";

export const GET_INGREDIENTS_REQUEST = "GET_INGREDIENTS_REQUEST";
export const GET_INGREDIENTS_SUCCESS = "GET_INGREDIENTS_SUCCESS";
export const GET_INGREDIENTS_ERROR = "GET_INGREDIENTS_ERROR";

export const SET_CURRENT_INGREDIENT = "SET_CURRENT_INGREDIENT";
export const CLEAR_CURRENT_INGREDIENT = "CLEAR_CURRENT_INGREDIENT";

export const INCREASE_INGREDIENT_COUNTER = "INCREASE_INGREDIENT_COUNTER";
export const DECREASE_INGREDIENT_COUNTER = "DECREASE_INGREDIENT_COUNTER";

export const getIngredients = () => async (dispatch) => {
  dispatch({
    type: GET_INGREDIENTS_REQUEST,
  });
  try {
    const items = await loadIngredients();
    dispatch({
      type: GET_INGREDIENTS_SUCCESS,
      items: items.map((item) => ({ ...item, counter: 0 })),
    });
  } catch (err) {
    dispatch({
      type: GET_INGREDIENTS_ERROR,
      message: err.message,
    });
  }
};
