import { checkoutOrder } from "../api";

export const CHECKOUT_ORDER_REQUEST = "CHECKOUT_ORDER_REQUEST";
export const CHECKOUT_ORDER_SUCCESS = "CHECKOUT_ORDER_SUCCESS";
export const CHECKOUT_ORDER_ERROR = "CHECKOUT_ORDER_ERROR";

export const doCheckoutOrder = () => async (dispatch, getState) => {
  const { bunItem, items } = getState().construct;

  if (!bunItem) {
    return dispatch({
      type: CHECKOUT_ORDER_ERROR,
      message: "Для оформления заказа добавьте булку!",
    });
  }

  const ids = [bunItem._id, ...items.map((el) => el._id), bunItem._id];

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
