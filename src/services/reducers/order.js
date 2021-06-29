import {
  CHECKOUT_ORDER_REQUEST,
  CHECKOUT_ORDER_SUCCESS,
  CHECKOUT_ORDER_ERROR,
  CLEAR_ORDER,
} from "../actions/order";

const orderState = {
  number: null,
  checkoutRequest: false,
  checkoutSuccess: false,
  checkoutErrorMessage: "",
};

export const orderReducer = (state = orderState, action) => {
  switch (action.type) {
    case CHECKOUT_ORDER_REQUEST:
      return {
        ...state,
        checkoutRequest: true,
        checkoutSuccess: false,
        checkoutErrorMessage: "",
        number: null,
      };

    case CHECKOUT_ORDER_SUCCESS:
      return {
        ...state,
        checkoutRequest: false,
        checkoutSuccess: true,
        number: action.number,
      };

    case CHECKOUT_ORDER_ERROR:
      return {
        ...state,
        checkoutRequest: false,
        checkoutSuccess: false,
        checkoutErrorMessage: action.message,
      };

    case CLEAR_ORDER:
      return orderState;

    default:
      return state;
  }
};
