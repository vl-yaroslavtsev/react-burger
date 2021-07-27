import {
  WS_PROFILE_CONNECTION_SUCCESS,
  WS_PROFILE_CONNECTION_ERROR,
  WS_PROFILE_CONNECTION_CLOSED,
  WS_PROFILE_GET_MESSAGE,
} from "../actions/ws-profile";

const initialState = {
  wsConnected: false,
  wsError: "",
  orders: [],
};

export const wsProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_PROFILE_CONNECTION_SUCCESS:
      return {
        ...state,
        wsError: "",
        wsConnected: true,
      };

    case WS_PROFILE_CONNECTION_ERROR:
      return {
        ...state,
        wsError: action.payload.message,
        wsConnected: false,
      };

    case WS_PROFILE_CONNECTION_CLOSED:
      return {
        ...state,
        wsError: "",
        wsConnected: false,
      };

    case WS_PROFILE_GET_MESSAGE:
      if (action.payload.message) {
        return {
          ...state,
          wsError: action.payload.message,
          orders: [],
        };
      }

      console.log("profile orders", action.payload);

      return {
        ...state,
        wsError: "",
        orders: action.payload.orders,
      };

    default:
      return state;
  }
};
