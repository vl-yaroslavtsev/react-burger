import { loadIngredients } from "../api";

export const GET_INGREDIENTS_REQUEST = "GET_INGREDIENTS_REQUEST";
export const GET_INGREDIENTS_SUCCESS = "GET_INGREDIENTS_SUCCESS";
export const GET_INGREDIENTS_ERROR = "GET_INGREDIENTS_ERROR";

export const getIngredients = () => async (dispatch) => {
  dispatch({
    type: GET_INGREDIENTS_REQUEST,
  });
  try {
    const items = await loadIngredients();
    dispatch({
      type: GET_INGREDIENTS_SUCCESS,
      items,
    });
  } catch (err) {
    dispatch({
      type: GET_INGREDIENTS_ERROR,
      message: err.message,
    });
  }
};
