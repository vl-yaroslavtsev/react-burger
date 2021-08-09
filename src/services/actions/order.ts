import { checkoutOrder } from "../api";
import { AppDispatch, AppThunk } from "../types";

export const CHECKOUT_ORDER_REQUEST = "CHECKOUT_ORDER_REQUEST";
export const CHECKOUT_ORDER_SUCCESS = "CHECKOUT_ORDER_SUCCESS";
export const CHECKOUT_ORDER_ERROR = "CHECKOUT_ORDER_ERROR";
export const CLEAR_ORDER = "CLEAR_ORDER";

export interface ICheckoutOrderRequestAction {
  readonly type: typeof CHECKOUT_ORDER_REQUEST;
}

export interface ICheckoutOrderSuccessAction {
  readonly type: typeof CHECKOUT_ORDER_SUCCESS;
  readonly number: number;
}

export interface ICheckoutOrderErrorAction {
  readonly type: typeof CHECKOUT_ORDER_ERROR;
  readonly message: string;
}

export interface IClearOrderAction {
  readonly type: typeof CLEAR_ORDER;
}

export type TOrderActions =
  | ICheckoutOrderRequestAction
  | ICheckoutOrderSuccessAction
  | ICheckoutOrderErrorAction
  | IClearOrderAction;

export const doCheckoutOrder: AppThunk =
  () => async (dispatch: AppDispatch, getState) => {
    const { bunItem, items } = getState().construct;

    if (!bunItem) {
      return dispatch({
        type: CHECKOUT_ORDER_ERROR,
        message: "Для оформления заказа добавьте булку!",
      });
    }

    const ids = [bunItem._id, ...items.map((el) => el._id)];

    dispatch({
      type: CHECKOUT_ORDER_REQUEST,
    });
    try {
      const data = await checkoutOrder(ids);
      dispatch({
        type: CHECKOUT_ORDER_SUCCESS,
        number: data.order.number,
      });
    } catch (err) {
      dispatch({
        type: CHECKOUT_ORDER_ERROR,
        message: err.message,
      });
    }
  };
