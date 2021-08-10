import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_ERROR,
} from "../actions/ingredients";

import { TIngredientsActions } from "../actions/ingredients";
import { IIngredient } from "../types/data";

export interface IIngredientsState {
  items: IIngredient[];
  itemsRequest: boolean;
  itemsSuccess: boolean;
  itemsErrorMessage: string;
}

const ingredientsState: IIngredientsState = {
  items: [],
  itemsRequest: false,
  itemsSuccess: false,
  itemsErrorMessage: "",
};

export const ingredientsReducer = (
  state: IIngredientsState = ingredientsState,
  action: TIngredientsActions
) => {
  switch (action.type) {
    case GET_INGREDIENTS_REQUEST:
      return {
        ...state,
        itemsRequest: true,
        itemsSuccess: false,
        itemsErrorMessage: "",
      };

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

    default:
      return state;
  }
};
