import { loadIngredients } from "../api";
import { AppDispatch, AppThunk } from "../types";
import { IIngredient } from "../types/data";

export const GET_INGREDIENTS_REQUEST = "GET_INGREDIENTS_REQUEST";
export const GET_INGREDIENTS_SUCCESS = "GET_INGREDIENTS_SUCCESS";
export const GET_INGREDIENTS_ERROR = "GET_INGREDIENTS_ERROR";

export type IGetIngredientsRequestAction = {
  readonly type: typeof GET_INGREDIENTS_REQUEST;
};

export interface IGetIngredientsSuccessAction {
  readonly type: typeof GET_INGREDIENTS_SUCCESS;
  readonly items: IIngredient[];
}

export interface IGetIngredientsErrorAction {
  readonly type: typeof GET_INGREDIENTS_ERROR;
  readonly message: string;
}

export type TIngredientsActions =
  | IGetIngredientsRequestAction
  | IGetIngredientsSuccessAction
  | IGetIngredientsErrorAction;

export const getIngredients: AppThunk = () => async (dispatch: AppDispatch) => {
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
