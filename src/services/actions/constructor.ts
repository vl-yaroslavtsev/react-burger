import { IIngredient, IConstructorIngredient } from "../types/data";

export const ADD_CONSTRUCTOR_INGREDIENT = "ADD_CONSTRUCTOR_INGREDIENT";
export const REMOVE_CONSTRUCTOR_INGREDIENT = "REMOVE_CONSTRUCTOR_INGREDIENT";
export const REORDER_CONSTRUCTOR_INGREDIENTS =
  "REORDER_CONSTRUCTOR_INGREDIENTS";
export const CLEAR_CONSTRUCTOR = "CLEAR_CONSTRUCTOR";

export interface IAddConstructorIngredientAction {
  readonly type: typeof ADD_CONSTRUCTOR_INGREDIENT;
  readonly item: IIngredient;
}

export interface IRemoveConstructorIngredientAction {
  readonly type: typeof REMOVE_CONSTRUCTOR_INGREDIENT;
  readonly item: IConstructorIngredient;
}

export interface IReorderConstructorIngredientsAction {
  readonly type: typeof REORDER_CONSTRUCTOR_INGREDIENTS;
  readonly dropIndex: number;
  readonly hoverIndex: number;
}

export interface IClearConstructorAction {
  readonly type: typeof CLEAR_CONSTRUCTOR;
}

export type TConstructorActions =
  | IAddConstructorIngredientAction
  | IRemoveConstructorIngredientAction
  | IReorderConstructorIngredientsAction
  | IClearConstructorAction;
